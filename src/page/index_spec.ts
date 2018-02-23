import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';


// SchematicTestRunner needs an absolute path to the collection to test.
const collectionPath = path.join(__dirname, '../collection.json');


describe('page', () => {
  it('requires required option', () => {
    // We test that
    const runner = new SchematicTestRunner('schematics', collectionPath);
    expect(() => runner.runSchematic('page', {}, Tree.empty())).toThrow();
  });

  it('page', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('page', { name: 'str' }, Tree.empty());

    // Listing files
    expect(tree.files.sort()).toEqual(['/allo', '/hola', '/page', '/page1']);
  });
});
