import { PushNotifications } from '@capacitor/push-notifications'

export const initPush = async () => {
  // ask permission
  let permStatus = await PushNotifications.checkPermissions()
  if (permStatus.receive !== 'granted') {
    permStatus = await PushNotifications.requestPermissions()
  }

  if (permStatus.receive !== 'granted') {
    console.log('Permissão negada para notificações push')
    return
  }

  //REgistration the service on push (FCM / APNs)
  await PushNotifications.register()

  //Listeren when is register
  PushNotifications.addListener('registration', (token) => {
    console.log('Token do dispositivo:', token.value)
    // 👉 Aqui deves enviar o token para o teu backend (PHP + BD)
  })

  // Error on register
  PushNotifications.addListener('registrationError', (err) => {
    console.error('Erro de registro:', err.error)
  })

  // When push is received
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notificação recebida:', notification)
  })

  // when click on notification
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Ação da notificação:', notification.notification)
    // 👉 Aqui podes redirecionar para a página da mensagem no app
  })
}
