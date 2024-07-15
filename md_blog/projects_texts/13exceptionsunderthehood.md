# C++ Exceptions under the hood

@meta docType notAPost

## Index

1. [C++ exceptions under the hood](md_blog/2013/0205_Cexceptionsunderthehood.md)
2. [C++ exceptions under the hood 2: a tiny ABI](md_blog/2013/0212_CexceptionsunderthehoodIIatinyABI.md)
3. [C++ exceptions under the hood 3: an ABI to appease the linker](md_blog/2013/0219_Cexceptionsunderthehood3anABItoappeasethelinker.md)
4. [C++ exceptions under the hood 4: catching what you throw](md_blog/2013/0226_Cexceptionsunderthehood4catchingwhatyouthrow.md)
5. [C++ exceptions under the hood 5: magic around \_\_cxa\_begin\_catch and \_\_cxa\_end\_catch](md_blog/2013/0305_Cexceptionsunderthehood5magicaround__cxa_begin_catchand__cxa_end_catch.md)
6. [C++ exceptions under the hood 6: gcc\_except\_table and the personality function](md_blog/2013/0319_Cexceptionsunderthehood7anicepersonality.md)
7. [C++ exceptions under the hood 7: a nice personality](md_blog/2013/0319_Cexceptionsunderthehood7anicepersonality.md)
8. [C++ exceptions under the hood 8: two-phase handling](md_blog/2013/0326_Cexceptionsunderthehood8twophasehandling.md)
9. [C++ exceptions under the hood 9: catching our first exception](md_blog/2013/0402_Cexceptionsunderthehood9catchingourfirstexception.md)
10. [C++ exceptions under the hood 10: \_Unwind\_ and call frame info](md_blog/2013/0409_Cexceptionsunderthehood10_Unwind_andcallframeinfo.md)
11. [C++ exceptions under the hood 11: reading a CFI table](md_blog/2013/0411_Cexceptionsunderthehood11readingaCFItable.md)
12. [C++ exceptions under the hood 12: and suddenly, reflexion in C++](md_blog/2013/0416_Cexceptionsunderthehood12andsuddenlyreflexioninC.md)
13. [C++ exceptions under the hood 13: setting the context for a landing pad](md_blog/2013/0425_Cexceptionsunderthehood13settingthecontextforalandingpad.md)
14. [C++ exceptions under the hood 14: multiple landing pads & the teachings of the guru](md_blog/2013/0423_Cexceptionsunderthehood14multiplelandingpadsamptheteachingsoftheguru.md)
15. [C++ exceptions under the hood 15: finding the right landing pad](md_blog/2013/0502_Cexceptionsunderthehood15findingtherightlandingpad.md)
16. [C++ exceptions under the hood 16: finding the right catch in a landing pad](md_blog/2013/0502_Cexceptionsunderthehood15findingtherightlandingpad.md)
17. [C++ exceptions under the hood 17: reflecting on an exception type and reading .gcc\_except\_table](md_blog/2013/0514_Cexceptionsunderthehood17reflectingonanexceptiontypeandreading.gcc_except_table.md)
18. [C++ exceptions under the hood 18: getting the right stack frame](md_blog/2013/0516_Cexceptionsunderthehood18gettingtherightstackframe.md)
19. [C++ exceptions under the hood 19: getting the right catch in a landing pad](md_blog/2013/0516_Cexceptionsunderthehood18gettingtherightstackframe.md)
20. [C++ exceptions under the hood 20: running destructors while unwinding](md_blog/2013/0528_Cexceptionsunderthehood20runningdestructorswhileunwinding.md)
21. [C++ exceptions under the hood 21: a summary and some final thoughts](md_blog/2013/0604_Cexceptionsunderthehood21asummaryandsomefinalthoughts.md)
22. [C++ exceptions under the hood appendix I: the true cost of an exception](md_blog/2013/0611_CexceptionsunderthehoodappendixIthetruecostofanexception.md)
23. [C++ exceptions under the hood appendix II: metaclasses and RTTI on C++](md_blog/2013/0613_CexceptionsunderthehoodappendixIImetaclassesandRTTIonC.md)
24. [C++ exceptions under the hood appendix III: RTTI and exceptions orthogonality](md_blog/2013/0725_CexceptionsunderthehoodappendixIIIRTTIandexceptionsorthogonality.md)

---

@include md_blog/2013/0205_Cexceptionsunderthehood.md

@include md_blog/2013/0212_CexceptionsunderthehoodIIatinyABI.md

@include md_blog/2013/0219_Cexceptionsunderthehood3anABItoappeasethelinker.md

@include md_blog/2013/0226_Cexceptionsunderthehood4catchingwhatyouthrow.md

@include md_blog/2013/0305_Cexceptionsunderthehood5magicaround__cxa_begin_catchand__cxa_end_catch.md

@include md_blog/2013/0319_Cexceptionsunderthehood7anicepersonality.md

@include md_blog/2013/0319_Cexceptionsunderthehood7anicepersonality.md

@include md_blog/2013/0326_Cexceptionsunderthehood8twophasehandling.md

@include md_blog/2013/0402_Cexceptionsunderthehood9catchingourfirstexception.md

@include md_blog/2013/0409_Cexceptionsunderthehood10_Unwind_andcallframeinfo.md

@include md_blog/2013/0411_Cexceptionsunderthehood11readingaCFItable.md

@include md_blog/2013/0416_Cexceptionsunderthehood12andsuddenlyreflexioninC.md

@include md_blog/2013/0425_Cexceptionsunderthehood13settingthecontextforalandingpad.md

@include md_blog/2013/0423_Cexceptionsunderthehood14multiplelandingpadsamptheteachingsoftheguru.md

@include md_blog/2013/0502_Cexceptionsunderthehood15findingtherightlandingpad.md

@include md_blog/2013/0502_Cexceptionsunderthehood15findingtherightlandingpad.md

@include md_blog/2013/0514_Cexceptionsunderthehood17reflectingonanexceptiontypeandreading.gcc_except_table.md

@include md_blog/2013/0516_Cexceptionsunderthehood18gettingtherightstackframe.md

@include md_blog/2013/0516_Cexceptionsunderthehood18gettingtherightstackframe.md

@include md_blog/2013/0528_Cexceptionsunderthehood20runningdestructorswhileunwinding.md

@include md_blog/2013/0604_Cexceptionsunderthehood21asummaryandsomefinalthoughts.md

@include md_blog/2013/0611_CexceptionsunderthehoodappendixIthetruecostofanexception.md

@include md_blog/2013/0613_CexceptionsunderthehoodappendixIImetaclassesandRTTIonC.md

@include md_blog/2013/0725_CexceptionsunderthehoodappendixIIIRTTIandexceptionsorthogonality.md

