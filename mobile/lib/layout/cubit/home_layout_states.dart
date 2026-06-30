abstract class HomeLayoutStates {}

class HomeLayoutInitialState extends HomeLayoutStates {}

class HomeLayoutChangeBottomNavState extends HomeLayoutStates {
  final int currentIndex;

  HomeLayoutChangeBottomNavState(this.currentIndex);
}
