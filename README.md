# Chat Form

[![NPM](https://nodei.co/npm/chat-form.png)](https://nodei.co/npm/chat-form/) <br />
[![CircleCI](https://circleci.com/gh/koechkevin/chat-form.svg?style=svg)](https://circleci.com/gh/koechkevin/chat-form)
[![npm version](https://badge.fury.io/js/chat-form.svg)](https://badge.fury.io/js/chat-form)
[![Coverage Status](https://coveralls.io/repos/github/koechkevin/chat-form/badge.svg?branch=master)](https://coveralls.io/github/koechkevin/chat-form?branch=master)

`chat-form` is a react based chat-bot like form that allows a dev user to customize the message response to a user on every entry and even add validation reply message with Typescript support.

### Why?

I needed to use in some of my projects.

### Installation

```shell script
 npm install chat-form
```

or

```shell script
 yarn add chat-form
```

### Usage

#### Import the component

##### Javascript

```js
import ChatBot from 'chat-form/dist/js/export';
```

or lazy load

```js
import React, { lazy, Suspense } from 'react';
const ChatBot = lazy(() => import('chat-form/dist/js/export'));
```

##### Typescript

```typescript
import ChatBot from 'chat-form';
```

or lazy load

```typescript
import React, { lazy, Suspense } from 'react';
const ChatBot = lazy(() => import('chat-form'));
```
### Example
```typescript jsx
import ChatBot from 'chat-form';

const Component = (props) => {

const [questions, setQuestions] = React.useState([
  {
    question: () => 'First Question',
    answerType: 'input',
    identifier: 'name',
    validator: {
      message: (value) => `Your name length should range between 5 - 26 characters`,
      validatorCallback: (value) => value.length > 4 && value.length < 27,
    },
  },
]);

return (
  <ChatBot
    lastMessage={'Last message after all the questions have been answered'}
    onAnswer={setQuestions}
    questions={questions}
  />
);

}
```

### **Interfaces**

####Validator
```typescript
interface ValidatorObject {
  message: (value: any) => string; // value argument is the user input value
  validatorCallback: (value: any) => boolean;
}
```
#### Question
```typescript
interface Question {
  question: (value: any) => string;
  answerType: 'paragraph' | 'input' | 'boolean' | 'select' | 'file' | 'number' | 'csv' | any;
  identifier: string; // identifier is the key of response values 
  options?: string[]; // only if answerType is select
  validator?: ValidatorObject;
}
```
#### Message
```typescript
interface Message {
  message: string;
  sender: 'bot' | 'user';
  time?: string;
  fileSrc?: string; // Required if message is of file type
  file?: File;
}
```
 #### Props
```typescript
interface Props {
  className?: string;
  lastMessage: (value: any) => string; // The message after all the values have been filled. It takes in an object of { [identifier]: user input }
  questions: Question[];
  initialMessages?: Message[];
  onAnswer: (questions: Question[], value?: any) => void; // where value is an object of { [identifier]: user input }
}
```
Here is the full [demo](https://react-chat-form.firebaseapp.com/)
