import qrcode
import qrcode.image.svg

url = "https://github.com/sofia-llacer-caro/friction-first"

img = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage)
img.save("qr.svg")