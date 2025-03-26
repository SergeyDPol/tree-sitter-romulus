package tree_sitter_romulus_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_romulus "github.com/sergeydpol/tree-sitter-romulus/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_romulus.Language())
	if language == nil {
		t.Errorf("Error loading Romulus grammar")
	}
}
