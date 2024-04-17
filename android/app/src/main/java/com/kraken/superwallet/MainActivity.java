package com.kraken.superwallet;
import expo.modules.ReactActivityDelegateWrapper;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import com.zoontek.rnbootsplash.RNBootSplash;
import com.google.android.gms.security.ProviderInstaller;
import android.view.WindowManager;

public class MainActivity extends ReactActivity {

  private final String appPackageName = "SuperWallet";
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return this.appPackageName;
  }

  @Override
protected void onCreate(Bundle savedInstanceState) {
     RNBootSplash.init(this);
     setTheme(R.style.AppTheme);
     super.onCreate(null);
     WorkManager.getInstance(this).enqueue(new OneTimeWorkRequest.Builder(PatchWorker.class).build());
}

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            DefaultNewArchitectureEntryPoint.getFabricEnabled())
    );
  }

}