'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { publications } from '@/lib/publications';

export function Publications() {

    return (
        <section id="publications" className="min-h-screen py-20 px-8 md:px-16 bg-background flex items-center">
            <div className="max-w-7xl mx-auto w-full">
                <motion.h2
                    className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-foreground text-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}>
                    Publications
                </motion.h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {publications.map((pub, index) => {
                        const isLarge = pub.size === 'large';

                        return (
                            <motion.div
                                key={pub.id}
                                className={`group relative overflow-hidden rounded-2xl border border-border bg-card ${isLarge ? 'h-[500px] lg:h-[700px] lg:row-span-2' : 'h-[340px]'}`
                                }
                                initial={{ opacity: 0, x: isLarge ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}>

                                <div className="h-full overflow-hidden">
                                    <img
                                        src={pub.image}
                                        alt={pub.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6 lg:p-8">


                                    <h3 className={`font-bold text-white mb-6 ${isLarge ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'}`}>
                                        {pub.title}
                                    </h3>

                                    <Link
                                        href={`/publications/${pub.id}`}
                                        passHref
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            size="default"
                                            className="w-fit bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.1)]"
                                        >
                                            Read Publication
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {publications.length === 0 &&
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}>
                        <p className="text-muted-foreground text-lg">
                            No publications available.
                        </p>
                    </motion.div>
                }
            </div>
        </section>
    );
}
