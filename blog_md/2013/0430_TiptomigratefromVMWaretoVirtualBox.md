# Tip to migrate from VMWare to VirtualBox

@meta publishDatetime 2013-04-30T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/04/tip-to-migrate-from-vmware-to-virtualbox.html

Some times (most times?) migrating from VMWare to VirtualBox can get quite complicated. Mounting a disk from one into the other nowadays usualy works but network stuff seems to break more often than not.

Here's a little tip for those times when you are trying to get the network for a VMW image working in VBox: try using the third network adapter, that seems to be the same PCI address VMWare uses (in my machine... results might vary).

