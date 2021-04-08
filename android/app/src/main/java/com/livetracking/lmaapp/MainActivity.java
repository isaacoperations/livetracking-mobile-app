package com.livetracking.lmaapp;

import android.os.Bundle;
import android.os.PersistableBundle;
import androidx.annotation.Nullable;
import com.facebook.react.ReactActivity;
import com.zoontek.rnbootsplash.RNBootSplash;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "livetracking";
  }

  @Override
  public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
    super.onCreate(savedInstanceState, persistentState);
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);
  }
}
