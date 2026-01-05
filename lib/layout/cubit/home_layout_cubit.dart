import 'package:college_project/layout/cubit/home_layout_states.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeLayoutCubit extends Cubit<HomeLayoutStates> {
  HomeLayoutCubit() : super(HomeLayoutInitialState());
  static HomeLayoutCubit get(BuildContext context) => BlocProvider.of(context);

  int currentIndex = 0;

  /// Change the current navigation tab
  void changeBottomNavBarIdx(int index) {
    currentIndex = index;
    emit(HomeLayoutChangeBottomNavState(index));
  }

  /// Reset to home tab
  void resetToHome() {
    changeBottomNavBarIdx(0);
  }
}
