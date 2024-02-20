# C++: Magic member callbacks

@meta publishDatetime 2009-07-21T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/07/c-magic-member-callbacks.html

Short post about C++ this time - though calling it a request would be more appropiate. I'm trying to create some kind of magic callback to do this:

```c++
class Caller {
 Callback c;
  public:
  Caller(Callback c) : c(c) {}
 void doit(){ c(this); }
};
```

Shouldn't be too difficult, right?

There are some hidden complexities, of course, mostly regarding the callback parameter type, but the idea is simple, keep the caller dependant only in the callback, not in the callee.

Templates are not a valid solution as the callee may have more than one callback (i.e. expect more than a single object to finish and call the callback) so the whole idea of this is having the callback "bind" to a member method when created, doesn't matter which one.

I have a solution, tough I'm not too happy about it for now. I'll post it next week, unless someone comes up with a better idea (you know how to submit it if you do, right?).


---
## In reply to [this post](), [Leonardo Secotaro]() commented @ 2009-07-31T14:25:20.000+02:00:


This is my implementation

```c++
/*----[CallBack.h]----*/
class CallBack {
 /* ... */
public:
 virtual void operator() (void*) = 0;
};

/*----[Objeto.h]----*/
#include "CallBack.h"
#include "Cain.h"
#include "Abel.h"

class Objeto: public CallBack{
 /* ... */
public:
 void Execute(){
 Abel *pObj = new Abel( this );
 Cain *pObj2 = new Cain( this );

 pObj->execute();

 pObj2->execute();

 delete pObj;
 delete pObj2;
 }

 /////////////////////////////////////////////////////
 void Doit_Abel(Abel* Who){

 /* ... */

 printf("I am a good Kidn");
 }

 //////////////////////////////////////////////////////
 void Doit_Cain(Cain* Who){

 /* ... */

 printf("I am a killern");
 }

 ///////////////////////////////////////////////////////
 void operator() (void* Who) {
 Adan *pFather = (Adan*) Who;

 //EntryPoint
 if (pFather->WhoamI() == CAIN )
 Doit_Cain( (Cain*)Who);
 else if (pFather->WhoamI() == ABEL )
 Doit_Abel( (Abel*)Who);
 }
};

/**----[Adan.h]----*/
enum Family{CAIN,ABEL};

class Adan{
public:
 virtual Family WhoamI()=0;
};

/*----[Abel.h]----*/
#include "CallBack.h"
#include "Adan.h"

class Abel: public Adan{
 /* ... */
 CallBack *_c;
public:
 Abel(CallBack *c): _c(c){}

 Family WhoamI(){ return ABEL;}

 void execute(){
 /*...*/
 printf("Abel::executen");
 (*_c)((void*)this);
 }
};

/*----[Cain.h]----*/
#include "CallBack.h"

class Cain: public Adan{
 /* ... */
 CallBack *_c;
public:
 Cain(CallBack *c): _c(c){}

 Family WhoamI(){ return CAIN;}

 void execute(){
 /*...*/
 printf("Cain::executen");
 (*_c)((void*)this);
 }
};

/*----[Main.h]----*/

int main(void) {

 Objeto *pObjeto = new Objeto();

 pObjeto->Execute();

 delete pObjeto;

 return EXIT_SUCCESS;
}

/*prints*/
Abel::execute
I am a good Kid
Cain::execute
I am a killer

/*--------------------------------*/
```

Original [published here](/md_blog/2009/0721_CMagicmembercallbacks.md).

---
## In reply to [this post](), [nico](/md_blog/youfoundadeadlink.md) commented @ 2009-08-02T22:30:14.000+02:00:

It does work but you're missing part of the "spec", you can't choose a callback function (i.e. you're tied to a single callback or a type overloaded callback).
Other than that, the code is quite close to what I've been looking for. Check the solution back in a couple of days (still working on it!)

Original [published here](/md_blog/2009/0721_CMagicmembercallbacks.md).
