"""Independent registry check via IANA RDAP bootstrap; falls back to whois for TLDs w/o RDAP (.cn).
Usage: rdap.py domain [domain...]  -> appends JSON lines to facts/rdap.jsonl"""
import json, sys, subprocess, urllib.request, datetime, re

UA = "Mozilla/5.0 (X11; Linux x86_64) r545-audit"
boot = json.load(urllib.request.urlopen(urllib.request.Request("https://data.iana.org/rdap/dns.json", headers={"User-Agent": UA}), timeout=30))
svc = {}
for tlds, urls in boot["services"]:
    for t in tlds:
        svc[t.lower()] = urls[0]

def rdap(domain):
    tld = domain.rsplit(".", 1)[1].lower()
    base = svc.get(tld)
    if not base:
        return {"domain": domain, "method": "no-rdap-in-iana-bootstrap", "base": None}
    url = base.rstrip("/") + "/domain/" + domain
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rdap+json"}), timeout=30)
        body = json.loads(r.read())
        exp = None
        for ev in body.get("events", []):
            if ev.get("eventAction") == "expiration":
                exp = ev.get("eventDate")
        reg = None
        for e in body.get("entities", []):
            if "registrar" in e.get("roles", []):
                for v in e.get("vcardArray", [None, []])[1]:
                    if v[0] == "fn":
                        reg = v[3]
        return {"domain": domain, "method": "rdap", "url": url, "status": r.status, "verdict": "registered", "expiration": exp, "registrar": reg, "ldhName": body.get("ldhName")}
    except urllib.error.HTTPError as e:
        return {"domain": domain, "method": "rdap", "url": url, "status": e.code, "verdict": "available" if e.code == 404 else f"http-{e.code}"}

def whois(domain):
    tld = domain.rsplit(".", 1)[1].lower()
    host = {"cn": "whois.cnnic.cn", "io": "whois.nic.io"}.get(tld)
    if not host:
        return {"domain": domain, "method": "whois", "error": "no server"}
    import socket
    try:
        s = socket.create_connection((host, 43), timeout=30)
        s.sendall((domain + "\r\n").encode())
        chunks = []
        while True:
            c = s.recv(4096)
            if not c:
                break
            chunks.append(c)
        s.close()
        out = b"".join(chunks).decode("utf-8", "ignore")
    except Exception as e:
        return {"domain": domain, "method": "whois", "server": host, "error": str(e)}
    if "No matching record" in out or "no matching record" in out.lower():
        v = "available"
    elif re.search(r"Domain Name:\s*" + re.escape(domain), out, re.I):
        v = "registered"
    else:
        v = "unknown"
    m = re.search(r"Expiration Time:\s*(\S+)", out)
    r = re.search(r"Sponsoring Registrar:\s*(.+)", out)
    return {"domain": domain, "method": "whois", "server": host, "verdict": v, "expiration": m.group(1) if m else None, "registrar": r.group(1).strip() if r else None, "raw_head": out.strip()[:200]}

for d in sys.argv[1:]:
    res = rdap(d)
    if res.get("method") == "no-rdap-in-iana-bootstrap":
        res = whois(d)
    res["checkedAt"] = datetime.datetime.now(datetime.UTC).isoformat(timespec="seconds")
    print(json.dumps(res, ensure_ascii=False))
    with open("/home/ubuntu/r545/facts/rdap.jsonl", "a") as f:
        f.write(json.dumps(res, ensure_ascii=False) + "\n")
