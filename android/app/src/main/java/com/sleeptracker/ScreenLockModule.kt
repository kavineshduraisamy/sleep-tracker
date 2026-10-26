package com.sleeptracker

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ScreenLockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ScreenLockModule"

    @ReactMethod
    fun getScreenLockSession(promise: Promise) {
        try {
            val prefs: SharedPreferences = reactApplicationContext.getSharedPreferences(
                ScreenReceiver.PREFS_NAME,
                Context.MODE_PRIVATE
            )

            val screenOff = prefs.getLong(ScreenReceiver.KEY_LAST_SCREEN_OFF, 0L)
            val screenUnlock = prefs.getLong(ScreenReceiver.KEY_LAST_SCREEN_UNLOCK, 0L)

            val map = Arguments.createMap()
            map.putDouble("lastScreenOff", screenOff.toDouble())
            map.putDouble("lastScreenUnlock", screenUnlock.toDouble())

            if (screenOff > 0L && screenUnlock > screenOff) {
                val diffMillis = screenUnlock - screenOff
                val diffMinutes = (diffMillis / (1000 * 60)).toInt()
                map.putInt("durationMinutes", diffMinutes)
            } else {
                map.putInt("durationMinutes", 0)
            }

            map.putBoolean("isAvailable", true)
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("SCREEN_LOCK_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun clearScreenLockSession(promise: Promise) {
        try {
            val prefs: SharedPreferences = reactApplicationContext.getSharedPreferences(
                ScreenReceiver.PREFS_NAME,
                Context.MODE_PRIVATE
            )
            prefs.edit().clear().apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CLEAR_ERROR", e.message, e)
        }
    }
}
