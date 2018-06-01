import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';


// SchematicTestRunner needs an absolute path to the collection to test.
const collectionPath = path.join(__dirname, '../collection.json');


describe('generate-const', () => {
  it('requires required option', () => {
    // We test that
    const runner = new SchematicTestRunner('schematics', collectionPath);
    expect(() => runner.runSchematic('generate-const', {}, Tree.empty())).toThrow();
  });

  it('generate-const', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('generate-const', { targetpath: 'str'}, Tree.empty());

    // Listing files
    expect(tree.files.sort()).toEqual(['/allo', '/hola', '/page', '/page1']);
  });
});
