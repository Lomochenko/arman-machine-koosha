from django.db import models


# Create your models here.

class About(models.Model):
    title = models.CharField(max_length=24, verbose_name='alt')
    photo = models.ImageField(upload_to='gallery/', verbose_name='عکس')
    description = models.TextField(verbose_name='توضیحات')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'توضیحات درباره ما'
        verbose_name_plural = 'توضیحات درباره ما'
        ordering = ('id',)


class Gallery(models.Model):
    title = models.CharField(max_length=24, verbose_name='alt')
    photo = models.ImageField(upload_to='gallery/', verbose_name='عکس')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'گالری'
        verbose_name_plural = 'گالری ما'
        ordering = ('id',)


class Employee(models.Model):
    title = models.CharField(max_length=24, verbose_name='نام')
    photo = models.ImageField(upload_to='team/', verbose_name='عکس')
    rule = models.CharField(max_length=24, verbose_name='شغل')
    description = models.TextField(verbose_name='توضیحات')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'تیم'
        verbose_name_plural = 'تیم ما'
        ordering = ('id',)


class Honer(models.Model):
    title = models.CharField(max_length=36, verbose_name='عنوان')
    award = models.CharField(max_length=36, verbose_name='جایزه')
    year = models.CharField(max_length=12, verbose_name='سال')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'افتخارات'
        verbose_name_plural = 'افتخارات ما'
        ordering = ('id',)


class Services(models.Model):
    title = models.CharField(max_length=48, verbose_name='عنوان')
    description = models.TextField(verbose_name='توضیحات')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'خدمات'
        verbose_name_plural = 'خدمات ما'
        ordering = ('id',)
