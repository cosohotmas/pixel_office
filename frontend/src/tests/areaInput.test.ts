// Test boundary behavior and compatibility, not just constant values.
// 상수 값 자체보다 경계 동작·호환성을 검증합니다.
import { expect, it } from "vitest";
import { evaluateAreaInput } from "../services/areaInput";

it.each([63,64,65])("evaluates canonical length %s independently of the raw budget", length=>{
  const value="가".repeat(length);
  expect(evaluateAreaInput(value)).toEqual(length<=64?{ok:true,area:value}:{ok:false,reason:"name_too_long"});
});
it.each([79,80,81])("bounds raw length %s before trimming a 64-unit name", length=>{
  const name="가".repeat(64), raw=" ".repeat(length-64)+name;
  expect(evaluateAreaInput(raw)).toEqual(length<=80?{ok:true,area:name}:{ok:false,reason:"raw_too_long"});
});
it.each([" seoul ","SeOuL","\t서울\n"])("preserves the existing trim and alias behavior: %j",raw=>{
  expect(evaluateAreaInput(raw)).toEqual({ok:true,area:"서울"});
});
it.each(["","   ","\t\n"])("rejects an empty normalized name: %j",raw=>{
  expect(evaluateAreaInput(raw)).toEqual({ok:false,reason:"empty"});
});
it.each(["서\n울","서\u0000울","서\u007f울"])("rejects a control that survives trim: %j",raw=>{
  expect(evaluateAreaInput(raw)).toEqual({ok:false,reason:"control"});
});
it.each([32,33])("counts supplementary characters as UTF-16 units: %s",length=>{
  const raw="😀".repeat(length);
  expect(evaluateAreaInput(raw)).toEqual(length===32?{ok:true,area:raw}:{ok:false,reason:"name_too_long"});
});
it("does not change case, Unicode normalization or slice an oversized identity",()=>{
  const original=" München e\u0301 ";
  expect(evaluateAreaInput(original)).toEqual({ok:true,area:"München e\u0301"});
  expect(evaluateAreaInput("x".repeat(65))).toEqual({ok:false,reason:"name_too_long"});
});
