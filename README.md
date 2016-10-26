![FireLoop.io](https://storage.googleapis.com/mean-expert-images/fireloop-logo.png)

##Presenting FireLoop

[FireLoop] is a [NodeJS] Real-Time Framework built on top of The Open Source [IBM's StrongLoop LoopBack] that implements a [Google's FireBase] alike API, deprecating the standard HTTP RESTful Communication Protocol from [LoopBack].

##Installing FireLoop CLI

````sh
$ npm install -g @mean.expert/fireloop
````

##Create FireLoop Project, Clients and SDK
````sh
$ mkdir myproject && cd myproject
$ fireloop
````

##Why FireLoop.io

>Motivation: My original intention was to create modules to improve my own experience while working with [LoopBack] and [Angular 2], mostly because [LoopBack] lacks of Modern Real-Time Features but also because it provides with great structure, modularity and extensibility.

>Suddenly a good amount of developers started to use the modules and see value on these, but after around 15 months of improving my own [LoopBack] experience; there are so many modules and configurations that it's starting to be difficult to do it and even to understand it.

>For that reason I decided that I needed to bundle everything together and provide a way to have all of these features automatically installed and configured, making the initial setup as easy as the final implementation.

Why [FireLoop]? Why not simply switch to [FireBase]? It's really simple, if you want to avoid any work related with the Back End, then you can just switch to [FireBase] right now.

But, if you need control over the Back-End and you need to integrate it with multiple third party systems and host it your self, then [FireLoop] is the option.

Then Why [FireLoop]? Why not simply switch to [Horizon]? Actually... I tried [Horizon] I was willing to write an article about it or even migrate to it, but then I realized that is far from what I expected, it's not even extensible right now.

And that my friends is the main reason that made me decide to extend [LoopBack] and come up with a more reliable platform in less of the time.

Of course, if you are already in love with [LoopBack], you have built a system and you are not willing to move to [FireBase], nor [Horizon] but you are eager start implementing Modern Real-Time functionalities, then you should also check the following information.

##FireLoop Documentation Index

- [App Tutorial](http://mean.expert/2016/10/10/angular-2-real-time-applications/)
- [Comparison Table](#comparison-table)
- [Install FireLoop Modules](https://github.com/mean-expert-official/loopback-component-realtime#loopback-component-real-time)
- [Using FireLoop through SDK Builder](#using-fireloop-through-sdk-builder)
- [How to Create Data](#how-to-create-data)
- [How to Remove Data](#how-to-remove-data)
- [Available Events](#available-events)
- [Read Data Using 'changes' Event](#read-data-using-changes-event)
- [Read Data Using 'value' Event](#read-data-using-value-event)
- [Listen 'child_added' Event](#listen-child_added-event)
- [Listen 'child_changed' Event](#listen-child_changed-event)
- [Listen 'child_removed' Event](#listen-child_removed-event)
- [Querying Data](#querying-data)
- [Working With Child References](working-with-child-references)

##Comparison Table

| Platform  | Meteor  | Horizon  | FireBase  | FireLoop  |
|-----------------------|---|---|---|---|
| Description | Open source platform for web, mobile and desktop.   | Real-time platform built on top of RethinkDB.  | BaaS Cloud platform for fast development of client Applications.   |  Real-time platform built on top of LoopBack and Express.js. |
| Real-Time             | Yes  | Yes  | Yes  | Yes  |
| UI Components         | Yes  | No  | No  | Not UI but WebRTC Components for Angular 2 are under development.  |
| Client SDK            | Monolithic | JavaScript Client  | SDKs for different languages  | Fully Typed Angular 2 SDK |
| Extensibility         | Meteor Modules | Not yet implemented Plug-In mechanism | None | Isomorphic (Universal) Models, Hooks, Mixins and Components.
| Scalability           | Uses MongoDB OpLog | Uses RethinkDB | Auto-scaling | Adapter Driven Architecture (Options: MongoDB PubSub, Redis, Kafka, Build your own driver) |
| Maturity              | Very mature | Not so mature, many pieces are not in place | Very Mature | Mature since it relies on LoopBack Maturity plus Modern Community Modules.|
| Open Source           | Yes | Yes | No | Yes |


##Using FireLoop through SDK Builder
The [FireLoop] integration is built in the SDK Builder, so you just need to generate and install the SDK as usual, but instead of using HTTP Services (ModelApis) we will use the new Real-Time module that includes [FireLoop] Integration.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';

@Component(...)

export class AppComponent {
  constructor(private realTime: RealTime) {
    this.realTime.FireLoop // explore with intellisense
  }
}
````

##How to Create Data
The following example will crate a new room instance through the new [FireLoop] API using WebSockets instead of the Standard [LoopBack] HTTP REST API protocol.
````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private room: Room = new Room({ name: 'Hello FireLoop Room' });
  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    this.RoomReference.create(this.room).subscribe((instance: Room) => console.log(instance));
  }
}
````
There will be always a new instance created after using the `create` method, but you can also use `upsert` which will `create` or `update` the instance.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private room: Room = new Room({ name: 'Hello FireLoop Room' });
  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    this.RoomReference.upsert(this.room).subscribe((instance: Room) => console.log(instance));
  }
}
````
By using upsert, [FireLoop] will verify if the item is already persisted and update it, otherwise it will create a new instance.

##How to Remove Data
The following example will remove a room instance through the new [FireLoop] API using WebSockets.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private room: Room = new Room({ name: 'Hello FireLoop Room' });
  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    this.RoomReference.upsert(this.room).subscribe((instance: Room) => {
       // Immediately remove Room after created
       this.RoomReference.remove(instance).subscribe((deleted: Room) => console.log(deleted));
    });
  }
}
````

##Available Events

| Event | Description |
|-------|-------------|
| changes | This event will return an array of persisted elements and will keep firing on any change for the current Model Reference        |
| value | This event will return an array of persisted elements and will keep firing when new values are added in the current Model Reference        |
|  child_added     |  This event will fire once for each persisted items and will keep firing when new values are added in the current Model Reference, returning only the newly created child element           |
| child_changed   | This event will fire once for each changed item. It will return a reference of the updated element  |
| child_removed   | This event will fire once for each removed items It will return a reference of the removed element  |


##Read Data Using 'changes' Event
This is the recommended read event for real-time lists because it will be in sync any time there is a reference modification; this means that at any addition, removal or modification of any child within the reference will trigger a client synchronization.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    this.RoomReference.on('changes').subscribe((rooms: Array<Room>) => console.log(rooms));
  }
}
````

##Read Data Using 'value' Event
Similar to Firebase, you are now able to listen for references changes by subscribing to the `value` event.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    this.RoomReference.on('value').subscribe((rooms: Array<Room>) => console.log(rooms));
  }
}
````
The example above will list the persisted items (Rooms) the first time and will keep firing every time there is a new value added.

When not query is defined the `value` Event will return the latest 100 records from the database. 

##Listen 'child_added' Event

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    this.RoomReference.on('child_added').subscribe((room: Room) => console.log(room));
  }
}
````
##Listen 'child_changed' Event

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    RoomReference.on('child_changed').subscribe((room: Room) => console.log(room));
  }
}
````

##Listen 'child_removed' Event

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    this.RoomReference.on('child_removed').subscribe((room: Room) => console.log(room));
  }
}
````

##Querying Data
Since the built in [LoopBack] Query Language is really mature, I decided to keep using it in order to allow you pull the information according your necessities.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    this.RoomReference.on('value', {
      limit: 10,
      order: 'id DESC',
      include: 'members'
    }).subscribe((room: Array<Room>) => console.log(room));
    // console.log will be an array of 10 or less rooms and will include
    // a members array for each room ordered by Id descendent
  }
}
````
For more information about how to query data see the following [documentation](https://docs.strongloop.com/display/public/LB/Querying+data)

##Working with Child References
Working with child references will allow you to persist a relation between a parent and a child reference. For instance when creating messages in a room chat, we want these to be persisted within the right Room.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, Message, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;
  private MessageReference: FireLoopRef<Message>;
  private room: Room = new Room({ name: 'FireLoop Room' });
  private message: Room = new Message({ text: 'Test Message' });

  constructor(private realTime: RealTime) {
    this.RoomReference = this.realTime.FireLoop.ref<Room>(Room);
    this.RoomReference.upsert(this.room).subscribe((instance: Room) => {

     // Create a Child Reference
     this.MessageReference = RoomReference.make(instance).child<Message>('messages');
     this.MessageReference.on('value').subscribe(
        (messages: Array<Message>) => this.logger.info(messages)
      );
      MessageReference.upsert(this.message).subscribe((res: Message) => console.log(res.text));
    }))
  }
}
````
The example above will create a new Room and then will create a MessageReference, now you can store or listen for messages within this specific room. Everything related with this reference will persist the relationship Parent -> Child.



[NodeJS]: http://nodejs.org
[Horizon]: http://horizon.io/
[FireLoop]: http://fireloop.io
[FireLoop.io]: http://fireloop.io
[FireBase]: https://firebase.google.com/
[Google's FireBase]: https://firebase.google.com/
[Angular 2]: http://angular.io
[LoopBack]: http://loopback.io
[IBM's StrongLoop LoopBack]: http://loopback.io
[LoopBack SDK Builder]: http://github.com/mean-expert-official/loopback-sdk-builder
[loopback-sdk-angular]: http://npmjs.org/package/loopback-sdk-angular
[loopback-component-pubsub]: http://npmjs.org/package/loopback-component-pubsub
[LoopBack Component Real-Time]: http://github.com/mean-expert-official/loopback-component-realtime