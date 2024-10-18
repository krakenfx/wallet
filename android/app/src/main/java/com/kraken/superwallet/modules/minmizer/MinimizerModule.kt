package com.kraken.superwallet.modules.minimizer

import android.app.Activity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MinimizerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "Minimizer"
    }

    @ReactMethod
    fun goBack() {
        val activity: Activity? = reactContext.currentActivity
        activity?.moveTaskToBack(true)
    }
}
