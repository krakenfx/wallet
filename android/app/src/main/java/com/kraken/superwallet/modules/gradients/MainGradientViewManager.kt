package com.kraken.superwallet.modules.gradients;

import android.content.Context
import android.graphics.drawable.LayerDrawable
import android.view.View
import androidx.core.content.res.ResourcesCompat
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.kraken.superwallet.R

class MainGradientViewManager : SimpleViewManager<View>() {

    override fun getName(): String {
        return "MainGradientView"
    }

    private fun setLayerOpacity(layerDrawable: LayerDrawable, layerIndex: Int, opacity: Double){
        layerDrawable.getDrawable(layerIndex).alpha = (255 * opacity).toInt()
    }
    private fun getBackgroundGradients(context: Context): LayerDrawable {

        val layerDrawable = ResourcesCompat.getDrawable(context.resources, R.drawable.wallet_gradient_bg, null) as LayerDrawable

        setLayerOpacity(layerDrawable, 0, 0.12)
        setLayerOpacity(layerDrawable, 1, 0.14)
        setLayerOpacity(layerDrawable, 2, 0.08)
        setLayerOpacity(layerDrawable, 3, 0.30)
        setLayerOpacity(layerDrawable, 4, 0.35)

        return layerDrawable
    }


    override fun createViewInstance(context: ThemedReactContext): View {

        val view =  View(context)
        view.background = getBackgroundGradients(context)
        return view
    }
}
