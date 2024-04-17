package com.kraken.superwallet.modules.boottime

import android.os.SystemClock
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise


class BootTimeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BootTime"
    }

    @ReactMethod
    fun getTimeSinceBooted(promise: Promise) {
        promise.resolve(SystemClock.elapsedRealtime().toDouble())
    }
}
