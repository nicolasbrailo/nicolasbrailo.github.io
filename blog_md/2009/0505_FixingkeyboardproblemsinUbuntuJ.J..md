# Fixing keyboard problems in Ubuntu J.J.

@meta publishDatetime 2009-05-05T11:55:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/05/fixing-keyboard-problems-in-ubuntu-jj.html

I recently metioned in my [Ubuntu J.J. review](/blog_md/2009/0427_UbuntuJ.J..md) I was experiencing some issues with the keyboard in Opera. Well, the solution is simple, though not easy to find: the culprit was a missing language pack.

While installing the OS I didn't have Internet connection (the Squid server died and left me with no repos to work with after installing) so it didn't download some required language files, thus screwing up non Gnome programs (Opera, in my case).

To fix this problem go to System > Administration > Language Support (1) and a notification should pop up if there are packages missing; install them and then uncheck "Use Input Method Engine ..." (2), then restart the session.

Everything should work fine now (áéíóú :)).

(1) Sistema > Administración > Soporte de Idiomas
(2) Usar motores de método de entrada (IME) para ...

