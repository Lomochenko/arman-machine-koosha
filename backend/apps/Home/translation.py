from modeltranslation.translator import translator, TranslationOptions
from .models import FirstContent, Manager, WhyUs


class FirstContentTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


class ManagerTranslationOptions(TranslationOptions):
    fields = ('title', 'since',)


class WhyUsTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


translator.register(FirstContent, FirstContentTranslationOptions)
translator.register(Manager, ManagerTranslationOptions)
translator.register(WhyUs, WhyUsTranslationOptions)
