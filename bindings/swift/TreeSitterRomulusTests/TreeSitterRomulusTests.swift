import XCTest
import SwiftTreeSitter
import TreeSitterRomulus

final class TreeSitterRomulusTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_romulus())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Romulus grammar")
    }
}
