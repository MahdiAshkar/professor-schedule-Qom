# professor_schedule_Nodejs

## features

1. استاد قابلیت ثبت نام دارد
2. استاد برنامه خود را در ترم و سال تحصیلی مختلف می تواند وارد کند
3. استاد قابلیت ویرایش اطلاعات خود دارد البته برای حفظ امنیت زمانی اطلاعات آن تغییر می کند که به ایمیلی که اول ثبت کرده است پیامی ارسال می شود با تایید آن تغییرات اعمال می شود .
4. تداخل های داخل برنامه چک می شود اطلاع داده می شود
5. استاد هر سلول از جدول که انتخاب می کند می تواند از مقادیر پیش فرض یا مقدار خودش وارد کند .
6. می توان در صفحه اصلی جست جو با گروه یا نام استاد انجام داد
7. قابلیت ارسال پیام بین دانشجو و استاد

# project launch

## change domain for CORS

If you change the domain of the frontend site application, you must change the origin_url in the app.js file from this domain https://schedule-professor-demo.liara.run to the domain you uploaded it to.

## change Environment Variable

MONGODB_URL => url database mongodb
MY_EMAIL,PASSWORD_EMAIL => confirm register change email
PORT = 3005
MONGODB_URL ="mongodb://"
JWT_SECRET_KEY = 'random'
COOKIE_SECRET_KEY = 'random'
MY_EMAIL = 'mahdi81.it@gmail.com'
PASSWORD_EMAIL = 'my password'

## install package

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run start
```
