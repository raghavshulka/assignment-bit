"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Pie, PieChart, Label } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ProgressBar from "./ProgressBar";
import html from "../../Assets/html.png";
import Modal from "./Modal";

interface ErrorState {
  rank?: string;
  percentile?: string;
  score?: string;
}

const SkillTest = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [rank, setRank] = useState<string>("0");
  const [percentile, setPercentile] = useState<string>("0");
  const [score, setScore] = useState<string>("0");
  const [errors, setErrors] = useState<ErrorState>({});

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRank = formData.get("rank") as string;
    const newPercentile = formData.get("percentile") as string;
    const newScore = formData.get("score") as string;

    const newErrors: ErrorState = {};

    if (!newRank) newErrors.rank = "Rank is required";
    else if (isNaN(Number(newRank)) || Number(newRank) < 1)
      newErrors.rank = "Invalid rank";

    if (!newPercentile) newErrors.percentile = "Percentile is required";
    else if (
      isNaN(Number(newPercentile)) ||
      Number(newPercentile) < 0 ||
      Number(newPercentile) > 100
    )
      newErrors.percentile = "Invalid percentile";

    if (!newScore) newErrors.score = "Score is required";
    else if (
      isNaN(Number(newScore)) ||
      Number(newScore) < 0 ||
      Number(newScore) > 15
    )
      newErrors.score = "Invalid score";

    if (Object.keys(newErrors).length === 0) {
      setRank(newRank);
      setPercentile(newPercentile);
      setScore(newScore);
      closeModal();
    } else {
      setErrors(newErrors);
    }
  };

  const areaChartData = useMemo(() => {
    const baseScore = Number(score) || 0;
    return [
      { label: "0", score: Math.max(0, baseScore - 6) }, // For 0%
      { label: "25", score: Math.max(0, baseScore - 3) }, // For 25%
      { label: "50", score: baseScore }, // For 50%
      { label: "75", score: Math.min(15, baseScore + 3) }, // For 75%
      { label: "100", score: Math.min(15, baseScore + 6) }, // For 100%
    ];
  }, [score]);

  const pieChartData = useMemo(
    () => [
      {
        category: "Correct",
        value: Number(score) || 0,
        fill: "blue",
      },
      {
        category: "Incorrect",
        value: 15 - (Number(score) || 0),
        fill: "white",
      },
    ],
    [score]
  );

  const chartConfig: ChartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex-1">
          <div className="flex">
            <h1 className="text-sm mb-4 w-full">Skill Test</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-md mb-6">
            <div className="flex items-center gap-3">
              <Image src={html} alt="icon" width={40} height={40} />
              <div>
                <p className="font-bold">Hyper Text Markup Language</p>
                <p className="text-sm text-gray-600">
                  Question 8 | Duration: 15 mins | Submitted on 5 June 2021
                </p>
              </div>
            </div>
            <button
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors"
            >
              Update
            </button>
          </div>

          <div className="border rounded-lg p-4 mb-6">
            <h2 className="font-bold text-lg mb-4">Quick Statistics</h2>
            <div className=" flex flex-row justify-center items-center   gap-4">
              {[
                { icon: "🏆", value: rank, label: "YOUR RANK" },
                { icon: "🗒️", value: `${percentile}%`, label: "PERCENTILE" },
                {
                  icon: "✅",
                  value: `${score} / 15`,
                  label: "CORRECT ANSWERS",
                },
              ].map((val, index) => (
                <div key={index} className="flex items-center justify-center">
                  <div className="text-3xl pr-3">{val.icon}</div>
                  <div>
                    <p className="font-bold text-xl">{val.value}</p>
                    <p className="text-sm text-gray-600">{val.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="font-bold text-lg mb-4">Comparison Graph</h2>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-center sm:text-left">
                You scored in the {percentile}th percentile, which is higher
                than the average percentile (72%) of all engineers who took this
                assessment.
              </p>
              <p className="text-5xl">📈</p>
            </div>

            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={areaChartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="score"
                    type="natural"
                    fill="var(--color-score)"
                    fillOpacity={0.4}
                    stroke="var(--color-score)"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </div>
        </div>

        <div className="flex-1">
          <div className="border p-4 rounded-lg mb-6 mt-8 ">
            <h2 className="font-bold text-lg mb-4">Syllabus-wise Analysis</h2>
            <div className="space-y-6">
              {[
                {
                  topic: "HTML Tools, Forms, History",
                  progress: 80,
                  color: "blue",
                },
                {
                  topic: "Tags & References in HTML",
                  progress: 60,
                  color: "orange",
                },
                { topic: "Tables & CSS Basics", progress: 24, color: "red" },
                {
                  topic: "HTML Attributes & CSS Properties",
                  progress: 96,
                  color: "green",
                },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="font-medium">{item.topic}</p>
                  <ProgressBar
                    progress={item.progress}
                    fillColor={item.color}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Question Analysis</h2>
              <p className="text-blue-600 font-bold">{score}/15</p>
            </div>
            <p className="mb-4">
              You answered {score} questions correctly out of 15.
              {Number(score) > 12
                ? " Great job!"
                : " There's still room for improvement!"}
            </p>
            <div className="flex justify-center">
              <div className="flex-1">
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square mt-4 max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="category"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-3xl font-bold"
                                  >
                                    {score}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground"
                                  >
                                    Score
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-3xl font-bold mb-4">Update score</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <label className="mb-1">🔵 Update your Rank</label>
            <input
              className={`border ${
                errors.rank ? "border-red-500" : "border-blue-700"
              } rounded-md p-2`}
              type="number"
              name="rank"
              defaultValue={rank}
              placeholder="Rank"
            />
            {errors.rank && (
              <p className="text-red-500 text-sm mt-1">{errors.rank}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1">🔵 Update your Percentile</label>
            <input
              className={`border ${
                errors.percentile ? "border-red-500" : "border-blue-700"
              } rounded-md p-2`}
              type="number"
              name="percentile"
              placeholder="Percentile"
              defaultValue={percentile}
            />
            {errors.percentile && (
              <p className="text-red-500 text-sm mt-1">{errors.percentile}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1">
              🔵 Update your current score (out of 15)
            </label>
            <input
              required
              className={`border ${
                errors.score ? "border-red-500" : "border-blue-700"
              } rounded-md p-2`}
              type="number"
              name="score"
              defaultValue={score}
              placeholder="Score"
            />
            {errors.score && (
              <p className="text-red-500 text-sm mt-1">{errors.score}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-white text-black hover:bg-gray-100 border border-black rounded-md px-4 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SkillTest;
