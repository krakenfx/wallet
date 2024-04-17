// BootTimeModule.swift
import Foundation
import React

@objc(BootTimeModule)
class BootTimeModule: NSObject {
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc(getTimeSinceBooted:rejecter:)
    func getTimeSinceBooted(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        var bootTime = timespec()
        clock_gettime(CLOCK_MONOTONIC, &bootTime)
        let timeMillis = Int64(bootTime.tv_sec) * 1000 + Int64(bootTime.tv_nsec) / 1_000_000
        resolve(timeMillis)
    }
}
