exec(open("/home/ubuntu/r537/agent-ui.py").read().replace("exec(sys.argv[1])",'''
 size(375)
 out=[]
 for path,query in [("/tld",".cn"),("/guide","saas"),("/vs","com vs cn")]:
  for lang in ["zh","en"]:
   nav(path+"?lang="+lang)
   for theme in ["light","dark"]:
    if page.evaluate("localStorage['domainhunter:theme']")!=theme:
     page.locator('header button[title="切换浅色/暗色"],header button[title="Toggle light/dark"]').click()
    page.locator("input[type=search]").fill(query)
    page.wait_for_timeout(250)
    shot("d-mobile-"+path[1:]+"-"+lang+"-"+theme+"-filter")
    text=page.locator("main").inner_text()
    page.locator("input[type=search]").fill("")
    page.locator('a[href^="#hub-g-"]').nth(1).click()
    page.wait_for_timeout(1100)
    row=page.evaluate("({hash:location.hash,top:document.querySelector(location.hash).getBoundingClientRect().top,nav:[...document.querySelectorAll('nav')].find(e=>/分组导航|Group navigation/.test(e.getAttribute('aria-label'))).getBoundingClientRect().bottom})")
    row.update(path=path,lang=lang,theme=theme,filterText=text)
    shot("d-mobile-"+path[1:]+"-"+lang+"-"+theme+"-landing")
    out.append(row)
 for slug in ["de","ar","ca","fr"]:
  for lang in ["zh","en"]:
   nav("/tld/"+slug+"?lang="+lang)
   h=page.get_by_role("heading",name="More TLD guides" if lang=="en" else "其他 TLD 指南",exact=True)
   h.scroll_into_view_if_needed()
   links=h.locator("..").locator('a[href^="/tld/"]').all_inner_texts()
   shot("e-price-free-"+slug+"-"+lang+"-375")
   out.append(dict(slug=slug,lang=lang,chips=links))
 print(json.dumps(out,ensure_ascii=False))
 open("/home/ubuntu/r537/agent-detail.json","w").write(json.dumps(out,ensure_ascii=False,indent=2))
'''))
