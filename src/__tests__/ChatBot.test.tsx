import React from 'react';
import { render } from '@testing-library/react';
import ChatBot from '../ChatBot';

const questions = [
  {
    question: () => 'First Question',
    answerType: 'input',
    identifier: 'name',
    validator: {
      message: () => `Your name length should range between 5 - 26 characters`,
      validatorCallback: jest.fn(),
    },
  },
];

test('chat bot render', () => {
  const onAnswer = jest.fn();
  const lastMessage = () => 'Last Message';
  const { getByText, getByTestId } = render(
    <ChatBot questions={questions} onAnswer={onAnswer} lastMessage={lastMessage} />,
  );
  const closeBtn = getByText(/×/i);
  expect(closeBtn).toBeInTheDocument();
  closeBtn.click();
  const openButton = getByTestId('open');
  openButton.click();
});

test('test', () => {
  const onAnswer = jest.fn();
  const lastMessage = () => 'Last Message';
  const initialMessages = [
    { message: 'Some Random Text', time: '', sender: 'user' as 'user' },
    {
      message: 'Some File',
      fileSrc: 'https://www.youtube.com/watch?v=Dr-apUEc-7o',
      time: '',
      sender: 'user' as 'user',
      file: new File(['(⌐□_□)'], 'chuck.pdf', { type: 'application/pdf' }),
    },
    {
      message: 'initial two',
      fileSrc: 'https://res.cloudinary.com/koech/image/upload/v1584434425/aoqxvjkdstv7fencxvok.png',
      time: '',
      sender: 'bot' as 'user',
      file: new File(['(⌐□_□)'], 'chuck.png', { type: 'image/png' }),
    },
    {
      message: 'Some File',
      fileSrc: 'https://www.youtube.com/watch?v=Dr-apUEc-7o',
      time: '',
      sender: 'user' as 'user',
      file: new File(['(⌐□_□)'], 'chuck.mp4', { type: 'video/mp4' }),
    },
  ];
  const { getByText } = render(
    <ChatBot initialMessages={initialMessages} questions={[]} onAnswer={onAnswer} lastMessage={lastMessage} />,
  );
  const message = getByText('initial two');
  expect(message).toBeInTheDocument();
});
