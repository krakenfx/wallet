import UIKit
import SwiftUI

class SwiftUIWrapper<T: View>: UIView {
  
  private(set) var hostingController: UIHostingController<T>
  
  init(rootView: T, frame: CGRect = .zero) {
    hostingController = UIHostingController(rootView: rootView)
    super.init(frame: frame)
    
    autoresizingMask = [.flexibleWidth, .flexibleHeight]
    backgroundColor = .clear
    hostingController.view.backgroundColor = backgroundColor
    hostingController.view.autoresizingMask = autoresizingMask
    hostingController.view.frame = self.bounds
    addSubview(hostingController.view)
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
}

