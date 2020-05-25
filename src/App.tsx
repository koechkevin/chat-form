import React, { FC } from 'react';
import ChatBot, { Question } from './ChatBot';
import styles from './App.module.scss';

const mockQuestions: Question[] = [
  {
    question: () => 'Hello, My name is Bot K3V, I will help you apply for the role. What is your name',
    answerType: 'input',
    identifier: 'name',
    validator: {
      message: (value) =>
        `${
          value.length < 5 ? 'Your name cannot be that short' : 'Your name cannot be definitely that long'
        }. \n\nYour name length should range between 5 - 26 characters`,
      validatorCallback: (value) => value.length > 4 && value.length < 27,
    },
  },
  {
    question: ({ name }) => {
      return `Nice to meet you ${name}. \n\nI will take you this process which should take you at most 5 minutes.\n\nPlease upload your resume below we will use for reference when you come for the in house interview`;
    },
    answerType: 'file',
    identifier: 'resume',
  },
  {
    question: ({ name = '' }) =>
      `Great ${name.split(' ')[0]}. \n\nIn less than 100 words, tell me about yourself. \n\nWho is ${
        name.split(' ')[0]
      }?`,
    answerType: 'paragraph',
    identifier: 'overview',
    validator: {
      validatorCallback: (value = '') => value.split(' ').length < 100,
      message: () => `Sorry, your information is TL;DR. Please keep it less than 100 words`,
    },
  },
  {
    question: () =>
      'Nice!. Which of the skills below identify with you? \n\nYou should have at least one of the skills to proceed',
    answerType: 'select',
    identifier: 'skills',
    options: ['HTML', 'CSS', 'Javascript', 'NodeJS', 'Typescript'],
    validator: {
      validatorCallback: (value) => value.length > 0,
      message: () => `You ought to have at least one skill to proceed`,
    },
  },
  {
    question: () =>
      'Which other skill not mentioned above do you have? \n\nIf None, just type None. \n\nIf more than one, list them as comma separated values.',
    answerType: 'csv',
    identifier: 'otherSkills',
  },
  {
    question: () => 'Where do you live. Tell me the name of your nearest City.',
    answerType: 'input',
    identifier: 'city',
  },
  {
    question: ({ name }) => `How old are you ${name}?`,
    answerType: 'number',
    identifier: 'age',
  },
  {
    question: () =>
      'Send me your mobile number. I will use it to contact you in case I need further information from you',
    answerType: 'input',
    identifier: 'mobile',
  },
];
const App: FC<{}> = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        padding: 32,
        boxSizing: 'border-box',
      }}
    >
      <ChatBot
        lastMessage={({ name = '' }) => `Thank you ${name}. I will get back to you through the information you shared.`}
        questions={mockQuestions}
        className={styles.demo}
      />
    </div>
  );
};

export default App;
