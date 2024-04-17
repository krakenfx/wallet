package com.kraken.superwallet.modules.gradients;

import android.content.Context
import android.graphics.drawable.LayerDrawable
import android.view.View
import androidx.core.content.res.ResourcesCompat
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.kraken.superwallet.R

class SheetGradientViewManager : SimpleViewManager<View>() {


    override fun getName(): String {
        return "SheetGradientView"
    }

    private fun setLayerOpacity(layerDrawable: LayerDrawable, layerIndex: Int, opacity: Double){
        layerDrawable.getDrawable(layerIndex).alpha = (255 * opacity).toInt()
    }

    private fun getSheetGradients(context: Context): LayerDrawable {

        val layerDrawable = ResourcesCompat.getDrawable(context.resources, R.drawable.wallet_gradient_sheet, null) as LayerDrawable

        setLayerOpacity(layerDrawable, 0, 0.30)
        setLayerOpacity(layerDrawable, 1, 1.00)
        setLayerOpacity(layerDrawable, 2, 0.35)
        setLayerOpacity(layerDrawable, 3, 0.40)
        setLayerOpacity(layerDrawable, 4, 0.15)
        setLayerOpacity(layerDrawable, 5, 0.15)

        return layerDrawable
    }



    override fun createViewInstance(context: ThemedReactContext): View {

        val view =  View(context)
        view.background = getSheetGradients(context)
        return view
    }
}
