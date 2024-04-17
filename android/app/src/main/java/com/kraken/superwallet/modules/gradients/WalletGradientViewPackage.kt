package com.kraken.superwallet.modules.gradients;

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager


class WalletGradientViewPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return emptyList()
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        val modules: MutableList<ViewManager<*, *>> = mutableListOf()
        modules.add(MainGradientViewManager())
        modules.add(SheetGradientViewManager())
        return modules
    }
}
