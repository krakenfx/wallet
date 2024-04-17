import Foundation
import SwiftUI
import React


@objc(SheetGradientViewManager)
class SheetGradientViewManager: RCTViewManager {
  override func view() -> UIView! {
    return SwiftUIWrapper(rootView: SheetGradient())
  }
  
  override class func requiresMainQueueSetup() -> Bool {
    return true
  }
}


struct SheetGradient: View {
  var body: some View {
    GeometryReader { geometry in
      let totalHeight = UIScreen.main.bounds.height - geometry.safeAreaInsets.top,
          totalWidth = UIScreen.main.bounds.width
      
      ZStack {
        Rectangle()
          .fill(RadialGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 0.4588235318660736, green: 0.21960784494876862, blue: 0.9607843160629272, alpha: 1)), location: 0),
              .init(color: Color(#colorLiteral(red: 0.1411764919757843, green: 0.1411764919757843, blue: 0.3960784375667572, alpha: 0)), location: 1)]),
            center: UnitPoint(x: 1.25, y: 1.1),
            startRadius: 0,
            endRadius: totalHeight*0.6
          ))
          .opacity(0.3)
        
        
        Rectangle()
          .fill(LinearGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 0.14802083373069763, green: 0.15615567564964294, blue: 0.40833333134651184, alpha: 0.44999998807907104)), location: 0),
              .init(color: Color(#colorLiteral(red: 0.054901961237192154, green: 0.054901961237192154, blue: 0.2078431397676468, alpha: 0)), location: 1)]),
            startPoint: UnitPoint(x: 0, y: 0),
            endPoint: UnitPoint(x: 1, y: 1)))
          .opacity(1)
        
        Rectangle()
          .fill(RadialGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 0.4588235318660736, green: 0.21960784494876862, blue: 0.9607843160629272, alpha: 1)), location: 0),
              .init(color: Color(#colorLiteral(red: 0.4588235318660736, green: 0.21960784494876862, blue: 0.9607843160629272, alpha: 0)), location: 1)]),
            center: UnitPoint(x: 0.85, y: 0),
            startRadius: 1,
            endRadius: totalHeight*0.6
          ))
          .blendMode(.overlay)
          .opacity(0.35)
        
        Rectangle()
          .fill(LinearGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)), location: 0),
              .init(color: Color(#colorLiteral(red: 0.05882352963089943, green: 0.05882352963089943, blue: 0.21176470816135406, alpha: 0)), location: 1)]),
            startPoint: UnitPoint(x: 0, y: 0),
            endPoint: UnitPoint(x: 1.1, y:0)))
          .blendMode(.overlay)
          .opacity(0.4)
        
        Rectangle()
          .fill(RadialGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 0.4588235318660736, green: 0.21960784494876862, blue: 0.9607843160629272, alpha: 1)), location: 0),
              .init(color: Color(#colorLiteral(red: 0.4588235318660736, green: 0.21960784494876862, blue: 0.9607843160629272, alpha: 0)), location: 1)]),
            center: UnitPoint(x: 1.6, y: 0),
            startRadius: 0,
            endRadius: totalHeight*0.75
          ))
          .opacity(0.15)
        
        Rectangle()
          .fill(RadialGradient(
            gradient: Gradient(stops: [
              .init(color: Color(#colorLiteral(red: 0.16078431904315948, green: 0.20000000298023224, blue: 0.43529412150382996, alpha: 1)), location: 0),
              .init(color: Color(#colorLiteral(red: 0.21568627655506134, green: 0.23529411852359772, blue: 0.529411792755127, alpha: 0)), location: 1)]),
            center: UnitPoint(x: 1, y:0),
            startRadius: 0,
            endRadius: totalHeight*0.85
          ))
          .opacity(0.15)
        
        
      }
      .frame(width: totalWidth, height: totalHeight)
      .edgesIgnoringSafeArea(.all)
      
    }
  }
}
