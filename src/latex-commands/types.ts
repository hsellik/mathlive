import type { Atom } from '../core/atom-class';
import type { ColumnFormat } from '../atoms/array';

import type { _Mathfield } from '../editor-mathfield/mathfield-private';
import type {
  ArgumentType,
  ParseMode,
  Variant,
  MathstyleName,
  LatexValue,
  Environment,
  Dimension,
} from '../public/core-types';
import type {
  AtomType,
  BBoxParameter,
  ContextInterface,
  CreateAtomOptions,
  PrivateStyle,
  ToLatexOptions,
} from '../core/types';
import type { Context } from 'core/context';
import type { Box } from 'core/box';

export type FunctionArgumentDefinition = {
  isOptional: boolean;
  type: ArgumentType;
};

export type Argument =
  | string
  | LatexValue
  | BBoxParameter
  | ColumnFormat[]
  | { group: Atom[] }
  | Atom[];

export type ParseResult =
  | Atom
  | PrivateStyle
  | ParseMode
  | MathstyleName
  | { error: string };

export type TokenDefinition = LatexSymbolDefinition | LatexCommandDefinition;

/** A LatexSymbol is a command associated with a
 * single codepoint, i.e. `\alpha`, but not `\sin`
 */
export type LatexSymbolDefinition = {
  definitionType: 'symbol';
  command?: string;
  type: AtomType;
  codepoint: number;
  variant?: Variant;

  /** For "f", "g" and "h" */
  isFunction?: boolean;

  /** Note: symbols never have serialize or render functions. They are here because a TokenDefinition
   * expect it.
   */
  serialize?: (atom: Atom, options: ToLatexOptions) => string;
  render?: (Atom: Atom, context: Context) => Box | null;

  frequency?: number;
  category?: string;
  template?: string;
};

/** A LatexCommand may have some or no arguments.
 * Unlike a LatexSymbol, it is associated with a more
 * complex Atom for rendering.
 */
export type LatexCommandDefinition<T extends Argument[] = Argument[]> = {
  definitionType: 'function';
  command?: string;
  params: FunctionArgumentDefinition[];
  /** Infix commands are generally deprecated in LaTeX, but there are
   * a few that we might encounter (e.g. \choose).
   */
  infix: boolean;

  /** If true, the command should be considered a function name, e.g. `\sin` */
  isFunction: boolean;

  /** The mode in which this command can be used */
  ifMode?: ParseMode;

  /**  */
  applyMode?: ParseMode;
  createAtom?: (options: CreateAtomOptions<T>) => Atom;
  applyStyle?: (
    command: string,
    args: (null | Argument)[],
    context: ContextInterface
  ) => PrivateStyle;
  serialize?: (atom: Atom, options: ToLatexOptions) => string;
  render?: (Atom: Atom, context: Context) => Box | null;

  frequency?: number;
  category?: string;
  template?: string;
};

export type EnvironmentDefinition = {
  /** If true, the 'content' of the environment is parsed in tabular mode,
   *  i.e. with '&' creating a new column and '\\' creating a new row.
   */
  tabular: boolean;
  params: FunctionArgumentDefinition[];
  createAtom: EnvironmentConstructor;
};

export type EnvironmentConstructor = (
  name: Environment,
  array: Atom[][][],
  rowGaps: Dimension[],
  args: (null | Argument)[]
) => Atom | null;
