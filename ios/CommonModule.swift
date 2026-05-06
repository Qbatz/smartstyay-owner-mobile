//
//  CommonModule.swift
//  smartstayOwnerApp
//
//  Created by Sujith on 14/03/26.
//

import Foundation
import React
import Network


@objc(CommonModule)
class CommonModule: NSObject {

  @objc
  func fetchBaseUrl(_ resolve: RCTPromiseResolveBlock,
                    rejecter reject: RCTPromiseRejectBlock) {
      resolve("https://webdevapi.qbatz.com")
  }
  
  @objc
  func fetchEnvironment(_ resolve: RCTPromiseResolveBlock,
                    rejecter reject: RCTPromiseRejectBlock) {
        resolve("dev")
  }
  @objc
  func checkInternet(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    let monitor = NWPathMonitor()
        let queue = DispatchQueue.global(qos: .background)

        monitor.pathUpdateHandler = { path in
            if path.status == .satisfied {
                resolve(true)
            } else {
                resolve(false)
            }
            monitor.cancel()
        }

        monitor.start(queue: queue)
     
  }
  
  
  @objc
  func downloadAndShareFile(_ fileUrl: String,
                            resolver resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard let url = URL(string: fileUrl) else {
        reject("INVALID_URL", "Invalid URL", nil)
        return
    }

    let task = URLSession.shared.downloadTask(with: url) { location, response, error in

        if let error = error {
            reject("DOWNLOAD_ERROR", error.localizedDescription, error)
            return
        }

        guard let location = location else {
            reject("DOWNLOAD_ERROR", "File download failed", nil)
            return
        }

        do {
            let fileName = url.lastPathComponent
            let cacheDir = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
            let sharedDir = cacheDir.appendingPathComponent("shared_files")

            if !FileManager.default.fileExists(atPath: sharedDir.path) {
                try FileManager.default.createDirectory(at: sharedDir, withIntermediateDirectories: true)
            }

            let destination = sharedDir.appendingPathComponent(fileName)

            if FileManager.default.fileExists(atPath: destination.path) {
                try FileManager.default.removeItem(at: destination)
            }

            try FileManager.default.moveItem(at: location, to: destination)

            DispatchQueue.main.async {
                self.shareFile(destination)
                resolve(true)
            }

        } catch {
            reject("FILE_ERROR", error.localizedDescription, error)
        }
    }

    task.resume()
  }

  private func shareFile(_ fileURL: URL) {

      let activityVC = UIActivityViewController(activityItems: [fileURL], applicationActivities: nil)

      if let rootVC = UIApplication.shared.keyWindow?.rootViewController {
          rootVC.present(activityVC, animated: true)
      }
  }
  
  @objc
  func downloadAndViewDocument(_ url: String,
                                 resolver resolve: @escaping RCTPromiseResolveBlock,
                                 rejecter reject: @escaping RCTPromiseRejectBlock) {

        guard let documentUrl = URL(string: url) else {
            reject("VIEW_ERROR", "Invalid URL", nil)
            return
        }

        DispatchQueue.main.async {
            if UIApplication.shared.canOpenURL(documentUrl) {
                UIApplication.shared.open(documentUrl, options: [:]) { success in
                    if success {
                        resolve(true)
                    } else {
                        reject("VIEW_ERROR", "Unable to open URL", nil)
                    }
                }
            } else {
                reject("VIEW_ERROR", "Cannot open this URL", nil)
            }
        }
    }
  
  @objc
   func makeCall(_ phoneNumber: String) {

       let phone = "tel://\(phoneNumber)"

       guard let url = URL(string: phone) else {
           return
       }
       DispatchQueue.main.async {
           if UIApplication.shared.canOpenURL(url) {
               UIApplication.shared.open(url, options: [:], completionHandler: nil)
           }
       }
   }
  
  @objc
   func getVersionName(_ resolve: RCTPromiseResolveBlock,
                       rejecter reject: RCTPromiseRejectBlock) {

     let info = Bundle.main.infoDictionary

     let version = info?["CFBundleShortVersionString"] as? String ?? ""
     
     resolve(version)
   }
  
  @objc
   func getBuildNumber(_ resolve: RCTPromiseResolveBlock,
                       rejecter reject: RCTPromiseRejectBlock) {

     let info = Bundle.main.infoDictionary

     let version = info?["CFBundleShortVersionString"] as? String ?? ""
     
     resolve(version)
   }
}
