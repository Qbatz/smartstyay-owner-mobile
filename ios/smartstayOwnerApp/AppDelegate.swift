import UIKit
import UserNotifications
import FirebaseCore
import FirebaseMessaging
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    FirebaseApp.configure()
    registerForPushNotifications(application)

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "smartstayOwnerApp",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // Asks for permission at launch, as MainActivity does on Android.
  private func registerForPushNotifications(_ application: UIApplication) {
    UNUserNotificationCenter.current().delegate = self
    Messaging.messaging().delegate = self
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { _, _ in }
    application.registerForRemoteNotifications()
  }

  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    // FCM needs the APNs device token before it can issue its own registration token.
    Messaging.messaging().apnsToken = deviceToken
  }
}

extension AppDelegate: MessagingDelegate {
  // FCM REGISTRATION TOKEN IS GENERATED HERE - the token the backend needs to send pushes to this
  // device. Called on first launch and again whenever FCM rotates the token (same role as
  // FirebaseServices.onNewToken on Android).
  //
  // It is stored for NotificationModule.fetchFcmToken. At login the JS sends that token to the server
  // with updateFcmToken (EnterPin.jsx), currently only on Android.
  // TODO(server): send fcmToken to the backend for iOS as well.
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    guard let fcmToken = fcmToken else { return }
    NotificationModule.storeFcmToken(fcmToken)
  }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
  // iOS hides notifications that arrive while the app is open unless asked to show them.
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .list, .sound, .badge])
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
