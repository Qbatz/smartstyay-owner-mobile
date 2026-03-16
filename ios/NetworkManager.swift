//
//  NetworkManager.swift
//  smartstayOwnerApp
//
//  Created by Sujith on 15/03/26.
//

import Network

class NetworkManager {

    static let shared = NetworkManager()
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue.global(qos: .background)

    var isConnected: Bool = false

    private init() {
        monitor.pathUpdateHandler = { path in
            self.isConnected = path.status == .satisfied
            if self.isConnected {
                print("Internet Available")
            } else {
                print("No Internet Connection")
            }
        }
        monitor.start(queue: queue)
    }
}
