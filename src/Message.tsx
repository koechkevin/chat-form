import React, {FC, useEffect, useState} from 'react';
import styles from './App.module.scss';
import description from './assets/description.svg';

export interface Message {
  message: string;
  sender: 'bot' | 'user';
  time?: string;
  canClick?: () => void;
  fileSrc?: string;
  file?: File;
}

const MessageView: FC<Message> = (props) => {
  const message = props;
  const [formattedTime, setFormatedTime] = useState<string>('');

  useEffect(() => {
    import('dayjs').then(({ default: moment }) => {
      setFormatedTime(moment(message.time).format('HH:mm'));
    })
  }, [message.time]);

  return (
    <div data-testid="message" style={{ minHeight: 32 }}>
      <div
        onClick={message.canClick}
        className={[message.sender === 'bot' ? styles.botText : styles.inputText, styles.text].join(' ')}
      >
        {message.message && <span>{message.message}</span>}
        {message.fileSrc && (
          <>
            {['image/png', 'image/jpg'].includes(message?.file?.type || '') && <img alt="" src={message.fileSrc} />}
            {['video/mp4'].includes(message?.file?.type || '') && <video src={message.fileSrc} />}
            {!['video/mp4', 'image/png', 'image/jpg'].includes(message?.file?.type || '') && (
              <div className={styles.attachment}>
                <div className={styles.image}>
                  <img alt="" src={description} />
                </div>
                <div className={styles.fileName}>{message?.file?.name}</div>
              </div>
            )}
          </>
        )}
        <span className={styles.time}>{formattedTime}</span>
      </div>
      <br />
    </div>
  );
};

export default MessageView
