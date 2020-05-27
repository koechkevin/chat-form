import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from 'react';
import styles from './App.module.scss';
import icon from './assets/icon.svg';
import send from './assets/send.svg';
import description from './assets/description.svg';
import TextareaAutosize from 'react-textarea-autosize';
import MessageView, { Message } from './Message';
import Options from './Options';
import moment from 'dayjs';

export interface Props {
  className?: string;
  lastMessage: (value: any) => string;
  questions: Question[];
  onAnswer: (questions: Question[], value?: any) => void;
  initialMessages?: Message[];
}

export interface ValidatorObject {
  message: (value: any) => string;
  validatorCallback: (value: any) => boolean;
}

export interface Question {
  question: (value: any) => string;
  answerType: 'paragraph' | 'input' | 'boolean' | 'select' | 'file' | 'number' | 'csv' | any;
  identifier: string;
  answer?: string | boolean | number | any;
  answered?: boolean;
  options?: string[];
  fileSrc?: string;
  validator?: ValidatorObject;
}

const ChatBot: FC<Props> = (props) => {
  const { className, questions, lastMessage, onAnswer, initialMessages = [] } = props;

  const [idleTime, setIdleTime] = useState<number>(0);

  const [keyValue, setKeyValue] = useState<any>({});

  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const updateQuestionsWithAnswers = (answer: any): void => {
    const val = currentQuestion && { ...keyValue, [currentQuestion.identifier]: answer };
    if (val) {
      setKeyValue(val);
    }

    const value = questions.map((each) =>
      each.identifier === currentQuestion?.identifier
        ? {
            ...each,
            answered: true,
            answer,
          }
        : each,
    );
    onAnswer(value, val);
  };
  const [open, setOpen] = useState<boolean>(true);
  const [value, setValue] = useState<string>('');

  const [chatList, setChatList] = useState<Message[]>(initialMessages);

  const [typing, setTyping] = useState<boolean>(false);
  const onChange = (e: any) => {
    e.persist();
    setValue(e.target.value);
  };

  const [selected, setSelected] = useState<string[]>([]);

  const onSelect = (select: string) => {
    const index = selected.findIndex((val: string) => val === select);
    if (index !== -1) {
      return setSelected((val) => val.filter((e, i) => i !== index));
    }
    setSelected((val) => [...val, select]);
  };

  const onSend = (): void => {
    setIdleTime(0);
    if (value) {
      const time = moment().format();
      setChatList((val) => [...val, { message: value, sender: 'user', time }]);
      const answer = currentQuestion?.answerType === 'csv' ? value.split(',') : value;
      if (currentQuestion?.validator) {
        const validatorCallBack = currentQuestion?.validator?.validatorCallback;
        if (validatorCallBack && !validatorCallBack(answer)) {
          setTyping(true);
          setTimeout(() => {
            setChatList((val) => [
              ...val,
              { message: currentQuestion?.validator?.message(value) || '', sender: 'bot', time },
            ]);
            setTyping(false);
          }, 1000);
          return;
        }
      }
      updateQuestionsWithAnswers(answer);
      setValue('');
      return;
    }
  };

  const onFinish = () => {
    setIdleTime(0);
    const time = moment().format();
    const message = !selected.length ? `My ${currentQuestion?.identifier} not listed` : ` - ${selected.join(`\n - `)}`;

    setChatList((val) => [...val, { message, sender: 'user', time }]);
    if (currentQuestion?.validator) {
      const validatorCallBack = currentQuestion?.validator?.validatorCallback;
      if (validatorCallBack && !validatorCallBack(selected)) {
        return setChatList((val) => [
          ...val,
          { message: currentQuestion?.validator?.message(selected) || '', sender: 'bot', time },
        ]);
      }
    }
    setCurrentQuestion(undefined);
    updateQuestionsWithAnswers(selected);
    setSelected([]);
  };

  const onEnter = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (e.charCode === 13 && value && !e.shiftKey) {
      onSend();
    }
  };

  useEffect(() => {
    setTyping(true);
    setTimeout(() => {
      const time = moment().format();
      const sender = 'bot';
      const unansweredQuestion = questions.find((question) => !question.answered);
      setCurrentQuestion(unansweredQuestion);
      if (unansweredQuestion) {
        const message = unansweredQuestion.question(keyValue);
        setChatList((val) => [...val, { message, sender, time }]);
      } else {
        const message = lastMessage(keyValue);
        setChatList((val) => [...val, { message, sender, time }]);
      }
      setTyping(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  useEffect(() => {
    const list = document.getElementById('chat-list-body') as HTMLDivElement;
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [chatList.length]);

  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        setIdleTime((val) => val + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
        setIdleTime(0);
      };
    }
  }, [open]);

  useEffect(() => {
    if (idleTime >= 300) {
      setOpen(false);
    }
  }, [idleTime, currentQuestion]);

  const [, setRef] = useState<HTMLInputElement | null>(null);
  const [file, setFile] = useState<{ src: any; file?: any }>({ src: '' });
  const onSelectFile = () => {
    const time = moment().format();
    setChatList((val) => [...val, { message: value, fileSrc: file.src, sender: 'user', time, file: file.file }]);
    updateQuestionsWithAnswers(file);
    setFile((val) => ({ ...val, src: '' }));
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files && (e.target.files[0] as Blob);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFile({ file, src: reader.result });
    };
  };

  return (
    <span className={[styles.chatBot, className].join(' ')}>
      <div
        style={{ height: open ? 600 : 0, width: open ? 320 : 0, transition: `height ${open ? 800 : 0}ms ease-out` }}
        className={styles.chatBody}
      >
        <div className={styles.header}>
          <div className={styles.botLogo}>BOT</div>
          <div className={styles.display}>
            <div style={{ fontWeight: 'bold' }}>Chat Assistant</div>
            <div style={{ marginTop: 4 }}>{typing ? 'typing...' : 'online'}</div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="close" className={styles.close}>
            &times;
          </button>
        </div>
        <div id="chat-list-body" className={styles.body}>
          {chatList.map((message: Message, index: number) => (
            <MessageView key={index} {...message} />
          ))}
          {currentQuestion?.options && (
            <Options onFinish={onFinish} options={currentQuestion.options} onSelect={onSelect} selected={selected} />
          )}
        </div>
        {idleTime > 240 && (
          <div
            onClick={() => setIdleTime(0)}
            className={styles.keepAlive}
            role="button"
            aria-label="keep open"
          >{`Chat assistant will close in ${300 - idleTime} seconds. Click here to keep alive`}</div>
        )}
        {file.src && (
          <div className={styles.preview}>
            {['image/png', 'image/jpg'].includes(file.file.type) && <img alt="" src={file.src} />}
            {['video/mp4'].includes(file.file.type) && <video src={file.src} />}
            {!['video/mp4', 'image/png', 'image/jpg'].includes(file?.file?.type || '') && (
              <div className={styles.attachment}>
                <img alt="" src={description} />
                <div className={styles.fileName}>{file?.file?.name}</div>
              </div>
            )}
          </div>
        )}
        {currentQuestion && (
          <div className={styles.footer}>
            {['input', 'csv', 'number'].includes(currentQuestion.answerType) && (
              <input
                placeholder="Jot something down"
                onKeyPress={onEnter}
                onChange={onChange}
                value={value}
                type={currentQuestion.answerType === 'number' ? 'number' : 'text'}
                className={styles.input}
              />
            )}
            {['paragraph'].includes(currentQuestion.answerType) && (
              <TextareaAutosize
                onKeyPress={onEnter}
                placeholder="Jot something down"
                onChange={onChange}
                value={value}
                maxRows={6}
                className={styles.input}
              />
            )}
            {currentQuestion.answerType === 'file' && (
              <div
                className={styles.uploader}
                role="button"
                onClick={() => {
                  const element = document.getElementById('file-id') as HTMLInputElement;
                  element && element.click();
                }}
                style={{ flex: 1 }}
                id="file-upload-id"
              >
                Upload a file
                <input
                  accept={'.pdf,.doc,.png,.jpg,.docx,.mp4,.mov'}
                  ref={setRef}
                  onChange={onChangeFile}
                  style={{ display: 'none' }}
                  id="file-id"
                  type="file"
                />
              </div>
            )}
            {currentQuestion.answerType !== 'select' && (
              <img
                role="button"
                onClick={currentQuestion.answerType === 'file' ? onSelectFile : onSend}
                className={styles.icon}
                alt=""
                src={send}
              />
            )}
          </div>
        )}
      </div>
      {!open && (
        <div
          tabIndex={0}
          data-testid="open"
          role="button"
          onClick={() => setOpen(true)}
          aria-label="send message"
          className={styles.button}
        >
          <img alt="" src={icon} />
        </div>
      )}
    </span>
  );
};

export default ChatBot;
