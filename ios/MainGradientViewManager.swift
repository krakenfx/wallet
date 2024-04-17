
import Foundation
import SwiftUI
import React


@objc(MainGradientViewManager)
class MainGradientViewManager: RCTViewManager {
  override func view() -> UIView! {
    return SwiftUIWrapper(rootView: MainGradient())
  }
  
  override class func requiresMainQueueSetup() -> Bool {
    return true
  }
}

struct MainGradient: View {
  var body: some View {
    GeometryReader { geometry in
      ZStack {
        
        Rectangle()
          .fill(RadialGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 0.4588235318660736, green: 0.21960784494876862, blue: 0.9607843160629272, alpha: 1)), location: 0),
              .init(color: Color(#colorLiteral(red: 0.4588235318660736, green: 0.21960784494876862, blue: 0.9607843160629272, alpha: 0)), location: 1)]),
            center: UnitPoint(x: 1.7, y: 0.5),
            startRadius: 1,
            endRadius: UIScreen.main.bounds.height*0.75
          ))
          .opacity(0.12)
        
        Rectangle()
          .fill(LinearGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 1, green: 0.686274528503418, blue: 0.5411764979362488, alpha: 0)), location: 0),
              .init(color: Color(#colorLiteral(red: 1, green: 0.686274528503418, blue: 0.5411764979362488, alpha: 1)), location: 1)]),
            startPoint: UnitPoint(x: 0.5, y: 0.5),
            endPoint: UnitPoint(x: 0.5, y: 1)))
          .opacity(0.14)
        
        Rectangle()
          .fill(RadialGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 1, green: 0.686274528503418, blue: 0.5411764979362488, alpha: 1)), location: 0),
              .init(color: Color(#colorLiteral(red: 1, green: 0.686274528503418, blue: 0.5411764979362488, alpha: 0)), location: 1)]),
            center: UnitPoint(x: 1, y: 0.4),
            startRadius: 0,
            endRadius: UIScreen.main.bounds.height*0.4
          ))
          .opacity(0.08)
        
        Rectangle()
          .fill(RadialGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 0.12941177189350128, green: 0.08627451211214066, blue: 0.3960784375667572, alpha: 1)), location: 0),
              .init(color: Color(#colorLiteral(red: 0.12941177189350128, green: 0.08627451211214066, blue: 0.3960784375667572, alpha: 0)), location: 1)]),
            center: UnitPoint(x: 1, y: 0.9),
            startRadius: 0,
            endRadius: UIScreen.main.bounds.height*0.9
          ))
          .opacity(0.3)
        
        Rectangle()
          .fill(LinearGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 0.4588235318660736, green: 0.21960784494876862, blue: 0.9607843160629272, alpha: 1)), location: 0),
              .init(color: Color(#colorLiteral(red: 0.4588235318660736, green: 0.21960784494876862, blue: 0.9607843160629272, alpha: 0)), location: 0.85)]),
            startPoint: UnitPoint(x: 1, y: 0),
            endPoint: UnitPoint(x: 0.4, y: 0.36)))
          .opacity(0.35)
      }
      .frame(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
      .edgesIgnoringSafeArea(.all)
    }
  }
}

