from modeltranslation.translator import translator, TranslationOptions
from .models import About, Honer, Employee, Services


class AboutTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


class EmployeeTranslationOptions(TranslationOptions):
    fields = ('title', 'rule', 'description')


class HonerTranslationOptions(TranslationOptions):
    fields = ('title', 'award', 'year')


class ServicesTranslationOptions(TranslationOptions):
    fields = ('title', 'description')


translator.register(About, AboutTranslationOptions)
translator.register(Employee, EmployeeTranslationOptions)
translator.register(Honer, HonerTranslationOptions)
translator.register(Services, ServicesTranslationOptions)
