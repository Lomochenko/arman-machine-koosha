from django.db import models


# Create your models here.


class FirstContent(models.Model):
    title = models.CharField(max_length=128, verbose_name='نام سایت')
    since = models.CharField(max_length=24, verbose_name='تاریخ')
    description = models.TextField(verbose_name='توضیحات اولیه سایت')
    photo = models.ImageField(upload_to='logo/', verbose_name='لوگو')
    is_active = models.BooleanField(default=False, verbose_name='فعال/غیر فعال')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'نام سایت'
        verbose_name_plural = 'نام سایت'
        ordering = ('id',)


class Manager(models.Model):
    title = models.CharField(max_length=128, verbose_name='نام')
    since = models.CharField(max_length=24, verbose_name='تاریخ تولد')
    photo = models.ImageField(upload_to='manager/', verbose_name='عکس')
    is_active = models.BooleanField(default=False, verbose_name='فعال/غیر فعال')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'مدیریت'
        verbose_name_plural = 'مدیریت'
        ordering = ('id',)


class WhyUs(models.Model):
    title = models.CharField(max_length=48, verbose_name='عنوان')
    description = models.TextField(verbose_name='توضیحات')
    icon = models.CharField(max_length=128, verbose_name='آیکون')
    is_active = models.BooleanField(default=False, verbose_name='فعال/غیر فعال')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'چرا ما'
        verbose_name_plural = 'چرا ما'
        ordering = ('id',)


class Client(models.Model):
    title = models.CharField(max_length=128, verbose_name='نام شرکت')
    photo = models.ImageField(upload_to='client/', verbose_name='عکس')
    is_active = models.BooleanField(default=False, verbose_name='فعال/غیر فعال')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'شرکت'
        verbose_name_plural = 'شرکت ها'
        ordering = ('id',)


class Footer(models.Model):
    telegram = models.URLField(verbose_name='لینک تلگرام')
    instagram = models.URLField(verbose_name='لینک اینستاگرام')
    whatsapp = models.URLField(verbose_name='لینک واتس اپ')
    office_phone = models.CharField(max_length=18, verbose_name='شماره دفتر')
    phone = models.CharField(max_length=18, verbose_name='شماره شخصی')
    is_active = models.BooleanField(default=False, verbose_name='فعال/غیر فعال')

    def __str__(self):
        return self.phone

    class Meta:
        verbose_name = 'اطلاعات فوتر'
        verbose_name_plural = 'اطلاعات فوتر'
        ordering = ('id',)
