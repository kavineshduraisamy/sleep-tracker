package com.sleeptracker

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences

class ScreenReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent?) {
        val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val now = System.currentTimeMillis()

        when (intent?.action) {
            Intent.ACTION_SCREEN_OFF -> {
                // Record the timestamp when the screen is turned off / phone is locked
                prefs.edit().putLong(KEY_LAST_SCREEN_OFF, now).apply()
            }
            Intent.ACTION_USER_PRESENT -> {
                // User unlocked the phone
                prefs.edit().putLong(KEY_LAST_SCREEN_UNLOCK, now).apply()
            }
        }
    }

    companion object {
        const val PREFS_NAME = "sleep_screen_lock_prefs"
        const val KEY_LAST_SCREEN_OFF = "last_screen_off_timestamp"
        const val KEY_LAST_SCREEN_UNLOCK = "last_screen_unlock_timestamp"
    }
}
