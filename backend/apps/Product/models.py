# Create your models here.
from django.db import models


class Category(models.Model):
    title = models.CharField(max_length=100, verbose_name='نام دسته')
    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
        verbose_name='اسلاگ'  # ← این رو خودت دستی وارد کن
    )
    is_active = models.BooleanField(default=True, verbose_name='فعال/غیر فعال')

    class Meta:
        verbose_name = 'دسته‌بندی'
        verbose_name_plural = 'دسته‌بندی‌ها'
        ordering = ('title',)

    def __str__(self):
        return self.title


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='دسته‌بندی'
    )
    title = models.CharField(max_length=150, verbose_name='عنوان محصول')
    short_description = models.CharField(max_length=300, blank=True, verbose_name='توضیح کوتاه')
    photo = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name='عکس')
    is_active = models.BooleanField(default=True, verbose_name='فعال/غیر فعال')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'محصول'
        verbose_name_plural = 'محصولات'
        ordering = ('-created_at',)

    def __str__(self):
        return self.title
