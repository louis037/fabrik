**Fabrik is the Joomla application builder.**

This is Sophist's fork of the main Fabrikar repo for Fabrik. 
This fork contains numerous enhancements and fixes that have been developed by Sophist
but which Fabrikar have not got the resources to merge into their codebase.

As a consequence Sophist is now maintaining a merged version of his fixes and enhancements and those from Fabrikar
for use in his own projects. 
Rather than keep these to himself he is also making these available for other Fabrik users to use if they so wish.

The detailed list of fixes and enhancements in this version of Fabrik can be found in [Sophist's Wiki page](https://github.com/Sophist-UK/joomla_fabrik/wiki). However the major ones are as follows:

1. Syntax error checking for PHP and Javascript code in Fabrik back end
2. Calc element can be SQL INT or DECIMAL or VARCHAR not just TEXT - which means you can index on it etc.
3. Enhancements to several validation plugins
4. Form modules can be forced to single column (useful if you want a module in a narrow side-bar.
5. In a list you can have a Group title displayed over the top of the headers for the groups columns.
6. Several improvements to error messages when your development creates a 500 error.
7. Significant improvements to Repeat Groups inc. making zero rows work and allowing you to specify a dynamic max no. of rows
8. Enhancements to back-end Elements list for sorting and drag and drop sequencing.
9. Performance improvements avoiding unnecessary database calls for read-only dbjoin elements.
10. Fix to databasejoin which resulted in incorrect database field type.

**Please note the following caveats** if you decide to "update from github" using this fork to take advantage of the above:

a. The code here is updated to include changes to Fabrikar's code base on a regular basis
but is not guaranteed to include the latest changes. 
If you need it brought up to date, please contact Sophist.

b. If you want fixes for code in this fork that is different from that in the main Fabrik code base, 
Sophist will do his best to fix things.
If it is an issue with the Fabrik code base, then you should ask for support as usual in the Fabrikar forums.

c. If you have also written fixes or enhancements of your own that are not being merged by Farikar into the main code base,
please feel free to raise a PR here and Sophist will merge it if he is happy with the code so that you won't lose
your changes if you need to "update from Github".

Installation
================

- Check out the files into your Joomla installations root directory
- Log into your Joomla administration control panel
- Go to Extensions > Extension Manager
- Click the 'Discover' link
- Click the 'Purge Cache' icon 
- Click the 'Discover' icon
- Select the Fabrik package and click the 'Install' icon

Enabling Plugins
================
Fabrik ships with several of the most common element and validation plugins, 
however to reduce installation package size not all available plugins are pre-installed.

All other element and validation plugins can be found by following these steps:

- Go to Extensions > Extension Manager
- Click the 'Discover' link
- Click the 'Purge Cache' icon 
- Click the 'Discover' icon
- Find the element or validation plugin you want to install
- Select it
- Click 'Install'
- Go to 'Manage' and make sure it is published

The element or validation plugin will then appear as an option when creating an element or validation.

Updating
================
Once you have installed Fabrik 3.x, if you want to stay up to date with the latest code updates 
between official releases, you can 'update from GitHub'.

Please see here for instructions on how to update from GitHub - 
[http://fabrikar.com/forums/index.php?wiki/update-from-github/](http://fabrikar.com/forums/index.php?wiki/update-from-github/).

Upgrading
================
At the time of an official release, please follow the steps here - [http://fabrikar.com/forums/index.php?wiki/upgrade-instructions/](http://fabrikar.com/forums/index.php?wiki/upgrade-instructions/)

Building
========
We have a Grunt build file which will create the Fabrik package for you, and place it in a folder /fabrik_build
The build relies on node-gpy, which depending on your operating system may require additional installations beyond node itself.
Please follow the instructions @ https://github.com/nodejs/node-gyp
 
Once done you should be able open a command prompt (best to run as administrator in Windows) and then do

> npm install
> Grunt

An additional tasks is available for minimising the javascript:

> Grunt js

Further Information
================

[Wiki](http://fabrikar.com/forums/index.php?wiki)  
[FAQ](http://fabrikar.com/forums/index.php?wiki/faq/)  
[Forum](http://fabrikar.com/forums/)  
[Things You Can Do](http://fabrikar.com/forums/index.php?wiki/things-you-can-do/)  
[Contribute Code](http://fabrikar.com/forums/index.php?wiki/contribute-code/)  
[Contribute Translation](http://fabrikar.com/forums/index.php?wiki/translations/)  
