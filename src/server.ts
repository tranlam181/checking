import express from 'express';
import webpush from 'web-push';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const vapidKey = {
  publicKey: process.env.VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
}
webpush.setVapidDetails('mailto:tranlam181@gmail.com', vapidKey.publicKey, vapidKey.privateKey);

const subscriptions: any[] = [];

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);

  console.log({ msg: '----------------[subscribe]', subscription, subscriptions })

  res.status(201).json({ status: 'success' });
});

app.post('/send-notification', (req, res) => {
  const notificationPayload = {
    title: 'New Notification',
    body: 'This is a new notification',
    icon: 'https://static.thenounproject.com/png/4291913-200.png',
    data: {
      url: 'http://localhost:3000'
    }
  }

  Promise.all(subscriptions.map(sub => webpush.sendNotification(sub, JSON.stringify(notificationPayload)))).then(() => res.status(200).json({ message: 'Notification sent successfully' })).catch(err => {
    console.error('Notification sent error', err);
    res.status(500);
  })
});

app.post('/clear', (req, res) => {
  subscriptions.length = 0;
  res.status(200).json({ message: 'success'});
})

app.listen(4000, () => {
  console.log('Server started at port 4000')
})
