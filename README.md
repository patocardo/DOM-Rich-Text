#Deprecated

What is DOM Rich Text?
DOM Rich Text is an alternative to the classical solution of an IFRAME with designMode activated or an element with ContentEditable activated. It relies in an object that allows the developer to work with multiple div tags in a document that can be edited through keyboard, mouse and several methods of the aV object, a javascript Object that controls the DOM structure of the area to edit.
DOM Rich Text is not a WYSIWYG Editor, but it is the canvas to construct it. Any javascript developer that entered to the world of rich text edition knows that there are a lot of limitations, obfuscations and browser incompatibilities with the classical approach, the solution always falls on the different already-made editors wich deal with execCommand method problems. But despite the beauty and completeness of those editors, many developers like me find themselves limited to what “designMode=true” can do.
Obviously, DOM Rich Text is not aimed to a simple-to-put interface, but it has a lot of methods, and will have more, that allow the developer to control the canvas that have the rich text. The current version of the code is distributed under the GNU licence, wich means that can be modified, but redistributed mentioning the names of the developers.
DOM Rich Text uses extensively comunes0_6.js, a javascript framework developed and maintained by myself, it have a lot of functions and prototyped methods that are very common in the javascript development. Perhaps in the future, mostly if I have collaborators, I will turn the basement to jQuery, Prototype or other popular framework.
Properties, Methods and particular Events are named by spanish complete or truncated words, that is because it allows me to avoid reserved words maintaining the meaning. This document contains a table of equivalences to allow a better comprehension.
How does DOM Rich Text Works?
DOM Rich Text explode all the text content into SPAN elements, each one with one character, images (IMG) and breaking lines (BR) are not embedded in SPAN, but are part of the history. The caret is also a SPAN element that is a child of document element and blinks thanks to a setInterval instruction. Caret is not invasive, it is displayed in a absolute position over elements, this characteristic allows browsers to read SPAN sequences as words.
DOM Rich Text starts an object wich have a lot of necessary properties for the performance of different canvas. Each canvas is composed by:
A hidden input with the original div's id, that contains the XHTML updated when user focus out of canvas
Div itself wich change its id after it is activated, and receive mouse events
Zero-width input text that receive the key events
When user down, move or up the mouse on the div, it focus on the text area, expect for a clients key event and do whatever function is attached to that event. So avoid to use focus an click event in the div, it wont work as expected. However, events are other advantage of DOM Rich Text, because it implements a lot of new events (they are not really Event objects but they trigger whatever are attached to them) that allows developers to attach functions to them.
Selection is also virtual, that is because I saw some limitation with .getSelection and .getRange at interfaces. At the beginning I tryied to work over Tim Down's masterpiece named Rangy, but I found problems with unicode characters, so I decided to turn it to SPAN+className. Parent elements are not selectes but by their displayed content which 'av_letra' className becomes 'av_letrasel'.
For practical reasons, I separated the marked elements from registered selections(ranges). It may be more difficult to understand, but it allows to do multiple selections, have different approaches to selections, drag and drop and other operations.