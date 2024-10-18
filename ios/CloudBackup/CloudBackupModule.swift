import Foundation
import AuthenticationServices
import React


enum CloudBackupErrorCode: String, CaseIterable {
  case canceled = "user_canceled"
  case noCredentialsFound = "no_credentials_found"
  case failed = "failed"
  case blobMutationFailed = "blob_mutation_failed"
  case unexpectedCredentialType = "unexpected_credential_type"
  case synchronizationFailed = "synchronization_failed"
  case dataConversionFailed = "data_conversion_failed"
  case unknown = "unknown"
  case createChallengeFailed = "create_challenge_failed"
}

@available(iOS 17.0, *)
@objc(CloudBackupModule)
class CloudBackupModule: NSObject {
  
  private var passkeyRegistrationDelegate: PasskeyRegistrationDelegate?
  private var passkeyReadDataDelegate: PasskeyReadDataDelegate?
  private var passkeyWriteDataDelegate: PasskeyWriteDataDelegate?
  
  private let knownCredentialsKey = "knownCredentials"
  
  
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    let errorCodeDict = CloudBackupErrorCode.allCases.reduce(into: [String: String]()) { dict, errorCode in
      dict[errorCode.rawValue] = errorCode.rawValue
    }
    return ["errorCode": errorCodeDict]
  }
  

  @objc(register:resolver:rejecter:)
  func register(user: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    passkeyRegistrationDelegate = PasskeyRegistrationDelegate(resolve: resolve, reject: reject)
    passkeyRegistrationDelegate?.performAuthorizationRequest(user: user)
  }
  
  @objc(readData:resolver:rejecter:)
  func readData(credentialIDString: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    passkeyReadDataDelegate = PasskeyReadDataDelegate(resolve: resolve, reject: reject)
    passkeyReadDataDelegate?.performAuthorizationRequest(credentialIDString: credentialIDString)
  }
  
  @objc(writeData:data:resolver:rejecter:)
  func writeData(credentialID: String, data: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    passkeyWriteDataDelegate = PasskeyWriteDataDelegate(resolve: resolve, reject: reject)
    passkeyWriteDataDelegate?.performAuthorizationRequest(credentialIDString: credentialID, data: data)
  }
  
  @objc(getKnownCredentials:rejecter:)
  func getKnownCredentials(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let store = NSUbiquitousKeyValueStore.default
    if let savedCredentials = store.array(forKey: knownCredentialsKey) as? [String] {
      resolve(savedCredentials)
    } else {
      resolve([])
    }
  }
  
  @objc(setKnownCredentials:resolver:rejecter:)
  func setKnownCredentials(credentials: [String], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let store = NSUbiquitousKeyValueStore.default
    store.set(credentials, forKey: knownCredentialsKey)
    if !store.synchronize() {
      reject(CloudBackupErrorCode.synchronizationFailed.rawValue, "Failed to synchronize NSUbiquitousKeyValueStore with iCloud", nil)
      return
    }
    resolve(nil)
  }
  
  @objc(addKnownCredential:resolver:rejecter:)
  func addKnownCredential(credential: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let store = NSUbiquitousKeyValueStore.default
    var credentials = store.array(forKey: knownCredentialsKey) as? [String] ?? []
    credentials.append(credential)
    store.set(credentials, forKey: knownCredentialsKey)
    if !store.synchronize() {
      reject(CloudBackupErrorCode.synchronizationFailed.rawValue, "Failed to synchronize NSUbiquitousKeyValueStore with iCloud", nil)
      return
    }
    resolve(nil)
  }

}

@available(iOS 17.0, *)
class PasskeyAuthorizationDelegate: NSObject, ASAuthorizationControllerPresentationContextProviding  {
  
  private let relyingPartyIdentifier = "kraken-wallet.com"
  
  let resolve: RCTPromiseResolveBlock
  let reject: RCTPromiseRejectBlock
  let provider: ASAuthorizationPlatformPublicKeyCredentialProvider
  
  init(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    self.resolve = resolve
    self.reject = reject
    self.provider = ASAuthorizationPlatformPublicKeyCredentialProvider(relyingPartyIdentifier: relyingPartyIdentifier)
  }
  
 
  func generateChallenge() -> Data? {
      var randomBytes = [UInt8](repeating: 0, count: 32)
      let result = SecRandomCopyBytes(kSecRandomDefault, randomBytes.count, &randomBytes)
      return result == errSecSuccess ? Data(randomBytes) : nil
  }

  
  func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
    return ASPresentationAnchor()
  }
  
  func performAuthorizationRequest(using platformKeyRequest: ASAuthorizationRequest, delegate: ASAuthorizationControllerDelegate, preferImmediatelyAvailableCredentials: Bool) {
    let authController = ASAuthorizationController(authorizationRequests: [platformKeyRequest])
    authController.delegate = delegate
    authController.presentationContextProvider = self
    if preferImmediatelyAvailableCredentials {
      authController.performRequests(options: .preferImmediatelyAvailableCredentials)
    } else {
      authController.performRequests()
    }
  }
  
  @objc(authorizationController:didCompleteWithError:) func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
    if let authError = error as? ASAuthorizationError {
      switch authError.code {
      case .canceled:
        if (authError.userInfo.isEmpty){
          reject(CloudBackupErrorCode.canceled.rawValue, "User has canceled", error)
        } else {
          reject(CloudBackupErrorCode.noCredentialsFound.rawValue, "No credentials available", error)
        }
        return
      case .failed:
        reject(CloudBackupErrorCode.failed.rawValue, "Authorization failed", error)
        return
      default:
        reject(CloudBackupErrorCode.unknown.rawValue, error.localizedDescription, error)
      }
    } else {
      reject(CloudBackupErrorCode.unknown.rawValue, error.localizedDescription, error)
    }
  }
  
}

@available(iOS 17.0, *)
class PasskeyRegistrationDelegate: PasskeyAuthorizationDelegate, ASAuthorizationControllerDelegate {
  
  func performAuthorizationRequest(user: String) {
    if let userID = user.data(using: .utf8) {
      guard let challenge = generateChallenge() else {
        reject(CloudBackupErrorCode.createChallengeFailed.rawValue, "Failed to generate challenge", nil)
        return
      }
      let platformKeyRequest = provider.createCredentialRegistrationRequest(challenge: challenge, name: user, userID: userID)
      platformKeyRequest.largeBlob = ASAuthorizationPublicKeyCredentialLargeBlobRegistrationInput.supportRequired
      performAuthorizationRequest(using: platformKeyRequest, delegate: self, preferImmediatelyAvailableCredentials: true)
    } else {
      reject(CloudBackupErrorCode.dataConversionFailed.rawValue, "Failed to generate userID for \(user)", nil)
    }
    
  }
  
  func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
    if let credential = authorization.credential as? ASAuthorizationPlatformPublicKeyCredentialRegistration {
      resolve(["credentialID":  credential.credentialID.base64EncodedString()])
    } else {
      reject(CloudBackupErrorCode.unexpectedCredentialType.rawValue, "Unexpected credential type", nil)
    }
  }
  
}

@available(iOS 17.0, *)
class PasskeyWriteDataDelegate: PasskeyAuthorizationDelegate, ASAuthorizationControllerDelegate {
  
  func performAuthorizationRequest(credentialIDString: String, data: String) {
    guard let challenge = generateChallenge() else {
      reject(CloudBackupErrorCode.createChallengeFailed.rawValue, "Failed to generate challenge", nil)
      return
    }
    let platformKeyRequest = provider.createCredentialAssertionRequest(challenge: challenge)
    platformKeyRequest.largeBlob = ASAuthorizationPublicKeyCredentialLargeBlobAssertionInput.write(Data(data.utf8))
    if let credentialID = Data(base64Encoded: credentialIDString) {
      platformKeyRequest.allowedCredentials = [ASAuthorizationPlatformPublicKeyCredentialDescriptor(credentialID:credentialID)]
      performAuthorizationRequest(using: platformKeyRequest, delegate: self, preferImmediatelyAvailableCredentials: true)
    } else {
      reject(CloudBackupErrorCode.dataConversionFailed.rawValue, "Failed to decode credentialID", nil)
    }
  }
  
  func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
    guard let credential = authorization.credential as? ASAuthorizationPlatformPublicKeyCredentialAssertion else {
      reject(CloudBackupErrorCode.unexpectedCredentialType.rawValue, "Unexpected credential type", nil)
      return
    }
    
    guard case .write(let success)? = credential.largeBlob?.result else {
      reject(CloudBackupErrorCode.blobMutationFailed.rawValue, "Failed to write data, no large blob found", nil)
      return
    }
    
    if success {
      resolve(["credentialID":  credential.credentialID.base64EncodedString()])
    } else {
      reject(CloudBackupErrorCode.blobMutationFailed.rawValue, "Failed to write data to large blob", nil)
    }
  }
}

@available(iOS 17.0, *)
class PasskeyReadDataDelegate: PasskeyAuthorizationDelegate, ASAuthorizationControllerDelegate {
  
  func performAuthorizationRequest(credentialIDString: String?) {
    guard let challenge = generateChallenge() else {
      reject(CloudBackupErrorCode.createChallengeFailed.rawValue, "Failed to generate challenge", nil)
      return
    }
    let platformKeyRequest = provider.createCredentialAssertionRequest(challenge: challenge)
    platformKeyRequest.largeBlob = ASAuthorizationPublicKeyCredentialLargeBlobAssertionInput.read
    if let credentialIDString = credentialIDString {
      guard let credentialID = Data(base64Encoded: credentialIDString) else {
        reject(CloudBackupErrorCode.dataConversionFailed.rawValue, "Failed to decode credentialID", nil)
        return
      }
      platformKeyRequest.allowedCredentials = [ASAuthorizationPlatformPublicKeyCredentialDescriptor(credentialID: credentialID)]
    }
    performAuthorizationRequest(using: platformKeyRequest, delegate: self, preferImmediatelyAvailableCredentials: true)
  }
  
  func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
    guard let credential = authorization.credential as? ASAuthorizationPlatformPublicKeyCredentialAssertion else {
      reject(CloudBackupErrorCode.unexpectedCredentialType.rawValue, "Unexpected credential type", nil)
      return
    }
    
    guard case .read(let blobData)? = credential.largeBlob?.result else {
      reject(CloudBackupErrorCode.blobMutationFailed.rawValue, "Failed to read data, no large blob found", nil)
      return
    }
    
    guard let blobData = blobData else {
      reject(CloudBackupErrorCode.blobMutationFailed.rawValue, "No blob data found", nil)
      return
    }
    
    guard let blob = String(data: blobData, encoding: .utf8) else {
      reject(CloudBackupErrorCode.dataConversionFailed.rawValue, "Failed to decode large blob", nil)
      return
    }
    
    resolve(["credentialID":  credential.credentialID.base64EncodedString(), "data": blob])
  }
}


