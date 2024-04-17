package com.kraken.superwallet;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import android.content.Context;
import com.google.android.gms.security.ProviderInstaller;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.GooglePlayServicesRepairableException;
import com.google.android.gms.common.GooglePlayServicesNotAvailableException;

import android.util.Log;

public class PatchWorker extends Worker {

    public PatchWorker(Context context, WorkerParameters params) {
        super(context, params);
    }

    @Override
    public Result doWork() {
        try {
            ProviderInstaller.installIfNeeded(getApplicationContext());
            Log.d("PatchWorker", "Provider installed or already up-to-date.");
        } catch (GooglePlayServicesRepairableException e) {
            Log.e("PatchWorker", "Google Play Services Repairable Exception", e);
            GoogleApiAvailability.getInstance()
                    .showErrorNotification(getApplicationContext(), e.getConnectionStatusCode());
            return Result.failure();
        } catch (GooglePlayServicesNotAvailableException e) {
            Log.e("PatchWorker", "Google Play Services Not Available Exception", e);
            return Result.failure();
        }
        
        return Result.success();
    }
}