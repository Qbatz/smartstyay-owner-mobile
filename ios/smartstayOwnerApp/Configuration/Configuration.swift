import Foundation

enum Configuration {

  static func fetchFromDictionary(key: String) -> String {
    guard let itemFromDictionary = Bundle.main.infoDictionary?[key] as? String,
          !itemFromDictionary.isEmpty else {
      fatalError("Could not find \(key) in info.plist")
    }

    return itemFromDictionary
  }
}
