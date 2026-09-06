layout=[]; matrix=[]; faqs=[]; chips=[]; hubland=[]; hubdata=[]
async def theme(want):
    dark=await page.evaluate("!document.documentElement.classList.contains('light')")
    if dark != (want=='dark'):
        await page.locator('header button[title]').last.click()
        await page.wait_for_timeout(150)
async def matrix_route(path,lang):
    await viewport(1280)
    await theme('light')
    name=(path.strip('/').replace('/','_') or 'home')+'_'+lang
    record=dict(route=path,lang=lang,h1=await page.locator('h1').all_text_contents(),screenshots=[])
    for width in [1280,375]:
        await viewport(width)
        await page.evaluate('scrollTo(0,0)')
        for mode in ['light','dark']:
            await theme(mode)
            await page.wait_for_timeout(150)
            snap=await shot('matrix_'+name+'_'+mode+'_'+str(width))
            record['screenshots'].append(snap)
            if width==375:
                geometry=await page.evaluate("({innerWidth,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,htmlClass:document.documentElement.className,bodyBackground:getComputedStyle(document.body).backgroundColor})")
                layout.append(dict(route=path,lang=lang,theme=mode,**geometry,screenshot=snap))
    matrix.append(record)
    save('layout-375.json',layout);save('route-matrix.json',matrix)

async def content(path,lang):
    await viewport(1280)
    await theme('light')
    ds=page.locator('main details')
    n=await ds.count()
    for i in range(n):
        if not await ds.nth(i).get_attribute('open')=='':
            await ds.nth(i).locator('summary').click()
    await ds.nth(0).scroll_into_view_if_needed()
    name=path.strip('/').replace('/','_')+'_'+lang
    fs=await shot('faq_'+name)
    link=ds.nth(2).locator('a[href^="#"]').first
    href=await link.get_attribute('href')
    await link.click()
    await page.wait_for_timeout(1100)
    top=await page.locator(href).evaluate('(e)=>e.getBoundingClientRect().top')
    faqs.append(dict(route=path,lang=lang,count=n,open=await page.locator('main details[open]').count(),anchor=href,top=top,pass_offset=60<=top<=120,screenshot=fs,landed_screenshot=await shot('faq_landed_'+name)))
    view=page.locator('main a[href*="#hub-g-"]').last
    chipinfo=await view.evaluate("(a)=>({href:a.getAttribute('href'),chips:[...a.parentElement.querySelectorAll('a')].filter(x=>x!==a).map(x=>x.getAttribute('href'))})")
    chipinfo.update(route=path,lang=lang)
    chips.append(chipinfo)
    if path.startswith('/vs/'):
        await viewport(375)
        table=page.locator('table')
        await table.scroll_into_view_if_needed()
        info=await table.evaluate("(t)=>{let p=t.parentElement;return {cols:t.querySelectorAll('th[scope=col]').length,rows:t.querySelectorAll('th[scope=row]').length,headers:[...t.querySelectorAll('th')].map(x=>x.textContent),wrapperWidth:p.clientWidth,wrapperScroll:p.scrollWidth,overflow:getComputedStyle(p).overflowX,documentWidth:document.documentElement.scrollWidth}}")
        info.update(route=path,lang=lang,screenshot=await shot('price_table_'+name+'_375'))
        tabledata.append(info)
        save('vs-price-tables.json',tabledata)
    save('faq-anchor-offsets.json',faqs);save('group-chips.json',chips)
    if path in ['/tld/com','/tld/at','/guide/saas','/vs/com-vs-cn']:
        await viewport(1280)
        await view.click()
        await page.wait_for_load_state('load')
        await page.wait_for_timeout(1300)
        result=await page.evaluate("()=>{let e=document.querySelector(location.hash);let nav=document.querySelector('nav[aria-label=\"分组导航\"],nav[aria-label=\"Group navigation\"]');return {url:location.href,hash:location.hash,top:e?.getBoundingClientRect().top,navBottom:nav?.getBoundingClientRect().bottom}}")
        result.update(source=path,lang=lang,screenshot=await shot('hub_landing_'+name))
        hubland.append(result);save('hub-anchor-landing.json',hubland)

tabledata=[]
async def run_matrix(routes):
    for path in routes:
        for lang in ['zh','en']:
            await go(path,lang)
            await matrix_route(path,lang)
            if path in ['/tld','/guide','/vs']:
                kind=path[1:]
                groups=await page.locator('section[id^="hub-g-"]').evaluate_all("(ss)=>ss.map(s=>({id:s.id,links:[...s.querySelectorAll('a')].map(a=>a.getAttribute('href'))}))")
                await viewport(1280)
                await theme('light')
                query={'tld':'.cn','guide':'saas','vs':'com vs cn'}[kind]
                await page.locator('input[type=search]').fill(query)
                await page.wait_for_timeout(300)
                info=dict(route=path,lang=lang,groups=groups,query=query,filtered=await page.locator('section[id^="hub-g-"] a').evaluate_all('(as)=>as.map(a=>a.getAttribute("href"))'),counter=await page.locator('input[type=search]').evaluate('(i)=>i.parentElement.textContent'),screenshot=await shot('hub_filter_'+kind+'_'+lang))
                hubdata.append(info);save('hub-filters.json',hubdata)
            elif path.count('/')==2:
                await content(path,lang)
            print('DONE '+path+' '+lang,flush=True)
