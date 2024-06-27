package com.kraken.superwallet.modules.activityLifecycle

import android.app.Activity
import android.app.Application
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule


class ActivityLifecycleModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var isInitialized = false

    override fun getName(): String {
        return "ActivityLifecycle"
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    @ReactMethod()
    fun init() {
        if (isInitialized){
            return
        }
        isInitialized = true
        currentActivity?.registerActivityLifecycleCallbacks(object : Application.ActivityLifecycleCallbacks {
            override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
            }
            override fun onActivityStarted(activity: Activity) {
                sendEvent("onActivityStarted")
            }
            override fun onActivityResumed(activity: Activity) {
                sendEvent("onActivityResumed")
            }
            override fun onActivityPaused(activity: Activity) {
                sendEvent("onActivityPaused")
            }
            override fun onActivityStopped(activity: Activity) {
                sendEvent("onActivityStopped")
            }
            override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {
            }
            override fun onActivityDestroyed(activity: Activity) {
            }
        })
    }

    private fun sendEvent(eventName: String) {
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, null)
    }
}
