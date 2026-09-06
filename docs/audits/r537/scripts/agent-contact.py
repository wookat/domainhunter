from PIL import Image,ImageDraw
import glob,os,sys
paths=sys.argv[1:]
for stem in paths:
 for lang in ["zh","en"]:
  files=[f"/home/ubuntu/r537/agent-shots/matrix-{stem}-{lang}-375-{theme}.png" for theme in ["light","dark"]]
  if not all(os.path.exists(f) for f in files):continue
  ims=[Image.open(f).convert("RGB") for f in files]
  out=Image.new("RGB",(750,842),"#dddddd")
  d=ImageDraw.Draw(out)
  for i,im in enumerate(ims):
   out.paste(im,(i*375,30));d.text((i*375+10,8),f"{stem} | {lang} | {['light','dark'][i]} | 375px",fill="black")
  out.save(f"/home/ubuntu/r537/agent-shots/pair-{stem}-{lang}.png")
